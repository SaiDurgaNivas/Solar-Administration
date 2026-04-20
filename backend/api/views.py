from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import User, CustomerProfile, AgentProfile, Installation, Booking, Bill, UsageTelemetry, BookingDocument, WorkerUpdate, CustomerReview, SupportTicket, WorkerAttendance, TeamTask, Notification
from .serializers import UserSerializer, AgentProfileSerializer, InstallationSerializer, BookingSerializer, BillSerializer, UsageTelemetrySerializer, BookingDocumentSerializer, WorkerUpdateSerializer, TeamTaskSerializer, CustomerReviewSerializer, SupportTicketSerializer, WorkerAttendanceSerializer, NotificationSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.mail import send_mail
from django.conf import settings

@api_view(['POST'])
def login_view(request):
    """
    Dummy check representing our secure backend login. 
    In prod, this returns a JWT or sets a session cookie.
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Please provide email and password'}, status=status.HTTP_400_BAD_REQUEST)

    # Simplified lookup for testing
    user = User.objects.filter(email=email).first()
    
    requested_role = request.data.get('role', 'customer')

    if not user:
        if email == "admin@gmail.com" and password == "admin123":
            user, _ = User.objects.get_or_create(username="Admin", email=email, role="admin")
            user.set_password('admin123')
            user.save()
        elif email == "agent@gmail.com" and password == "agent123":
            user, _ = User.objects.get_or_create(username="Agent", email=email, role="agent")
            user.set_password('agent123')
            user.save()
        elif email == "worker@gmail.com" and password == "worker123":
            user, _ = User.objects.get_or_create(username="Worker", email=email, role="sub_worker")
            user.set_password('worker123')
            user.save()
        else:
            return Response({'error': 'No account found with this email. Please register.'}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        if not user.check_password(password):
            return Response({'error': 'Incorrect password. Try again.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        # Ensure user can only login to their specific portal (admins can login anywhere)
        if user.role != requested_role and user.role != 'admin':
            return Response({'error': f'Access Denied: You do not have {requested_role} clearance.'}, status=status.HTTP_403_FORBIDDEN)

    # Create dummy data on first customer creation
    if user.role == 'customer' and not Installation.objects.filter(client=user).exists():
        Installation.objects.create(system="5KW Residential Setup", status="Pending", client=user, location="Demo Site")
        Bill.objects.create(client=user, bill_no=f"B001-{user.id}", units=120, amount=1500, loan=500, subsidy=200, downpayment=800, status="Paid")
        Bill.objects.create(client=user, bill_no=f"B002-{user.id}", units=95, amount=1100, loan=400, subsidy=150, downpayment=550, status="Unpaid")
        Bill.objects.create(client=user, bill_no=f"B003-{user.id}", units=140, amount=1800, loan=700, subsidy=300, downpayment=800, status="Paid")
        UsageTelemetry.objects.create(client=user, monthly_avg=140, total_units=450, efficiency=91)

    serializer = UserSerializer(user)
    return Response({'user': serializer.data, 'token': 'dummy-token-for-now'})

@api_view(['POST'])
def register_view(request):
    """
    Register a new user account using the UserSerializer for consistency.
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            return Response({
                'message': 'Registration successful',
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Registration save error: {str(e)}")
            return Response({'error': f'Server Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def oauth_login_view(request):
    """
    Simulates Google/Email SSO login from Web.
    """
    email = request.data.get('email')
    if not email:
        return Response({'error': 'No web email provided for OAuth'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.filter(email=email).first()

    if not user:
        requested_role = request.data.get('role', 'customer')
        if requested_role not in ['admin', 'agent', 'sub_worker', 'customer']:
            requested_role = 'customer'

        user = User.objects.create(
            username=email,
            email=email,
            role=requested_role
        )
        user.set_password('oauth_magic_123')
        user.save()

        # Seed initial data for demo
        Installation.objects.create(system="10KW Smart Grid SSO", status="Pending", client=user, location="Web Client Area")
        UsageTelemetry.objects.create(client=user, monthly_avg=100, total_units=200, efficiency=99)

    serializer = UserSerializer(user)
    return Response({'user': serializer.data, 'token': 'oauth-session-token'})
@api_view(['POST'])
def update_agent_profile(request):
    """
    Update the logged-in agent's profile details.
    """
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.filter(id=user_id).first()
    if not user or user.role != 'agent':
        return Response({'error': 'Agent not found'}, status=status.HTTP_404_NOT_FOUND)
    
    profile, _ = AgentProfile.objects.get_or_create(user=user)
    
    # Update fields
    if 'phone' in request.data: profile.phone = request.data['phone']
    if 'address' in request.data: profile.address = request.data['address']
    if 'status' in request.data: profile.status = request.data['status']
    if 'profile_photo' in request.FILES: profile.profile_photo = request.FILES['profile_photo']
    
    profile.save()
    
    return Response({'message': 'Profile updated successfully', 'agent_profile': AgentProfileSerializer(profile).data})

class AgentProfileViewSet(viewsets.ModelViewSet):
    queryset = AgentProfile.objects.all()
    serializer_class = AgentProfileSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        agent_id = self.request.query_params.get('agent_id', None)
        
        if role:
            queryset = queryset.filter(role=role)
        if agent_id:
            # Filter sub workers assigned to this agent
            queryset = queryset.filter(subworker_profile__agent=agent_id)
            
        return queryset

class InstallationViewSet(viewsets.ModelViewSet):
    queryset = Installation.objects.all()
    serializer_class = InstallationSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset = Booking.objects.all()
        client_id = self.request.query_params.get('client_id')
        agent_id = self.request.query_params.get('agent_id')
        status_filter = self.request.query_params.get('status')
        
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        if agent_id:
            queryset = queryset.filter(agent_id=agent_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset.order_by('-created_at')

class BookingDocumentViewSet(viewsets.ModelViewSet):
    queryset = BookingDocument.objects.all()
    serializer_class = BookingDocumentSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def get_queryset(self):
        booking_id = self.request.query_params.get('booking_id')
        if booking_id:
            return BookingDocument.objects.filter(booking_id=booking_id)
        return BookingDocument.objects.all()

from django.utils import timezone

class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

    def get_queryset(self):
        client_id = self.request.query_params.get('client_id')
        if client_id:
            return Bill.objects.filter(client_id=client_id)
        return Bill.objects.all()

    def perform_create(self, serializer):
        if serializer.validated_data.get('status') == 'Paid':
            serializer.save(paid_at=timezone.now())
        else:
            serializer.save()

    def perform_update(self, serializer):
        if serializer.validated_data.get('status') == 'Paid' and serializer.instance.status != 'Paid':
            bill = serializer.save(paid_at=timezone.now())
            # 🔥 AUTOMATIC SUBSIDY NOTIFICATION
            Notification.objects.create(
                user=bill.client,
                title="✨ Subsidy Successfully Disbursed!",
                message=f"Congratulations! Since your ledger {bill.bill_no} is now fully settled, your Government Subsidy of ₹{bill.subsidy.toLocaleString if hasattr(bill.subsidy, 'toLocaleString') else bill.subsidy} has been automatically credited to your node profile."
            )
        else:
            serializer.save()

class UsageTelemetryViewSet(viewsets.ModelViewSet):
    queryset = UsageTelemetry.objects.all()
    serializer_class = UsageTelemetrySerializer

    def get_queryset(self):
        client_id = self.request.query_params.get('client_id')
        if client_id:
            return UsageTelemetry.objects.filter(client_id=client_id)
        return UsageTelemetry.objects.all()

# ViewSets for Worker and Support models


class WorkerAttendanceViewSet(viewsets.ModelViewSet):
    queryset = WorkerAttendance.objects.all()
    serializer_class = WorkerAttendanceSerializer

    def get_queryset(self):
        worker_id = self.request.query_params.get('worker_id')
        if worker_id:
            return WorkerAttendance.objects.filter(worker_id=worker_id)
        return WorkerAttendance.objects.all()

class TeamTaskViewSet(viewsets.ModelViewSet):
    queryset = TeamTask.objects.all()
    serializer_class = TeamTaskSerializer

    def get_queryset(self):
        queryset = TeamTask.objects.all().order_by('-updated_at')
        agent_id = self.request.query_params.get('agent', None)
        sub_worker_id = self.request.query_params.get('sub_worker', None)
        status = self.request.query_params.get('status', None)
        
        if agent_id:
            queryset = queryset.filter(agent_id=agent_id)
        if sub_worker_id:
            queryset = queryset.filter(sub_worker_id=sub_worker_id)
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset

class WorkerUpdateViewSet(viewsets.ModelViewSet):
    queryset = WorkerUpdate.objects.all()
    serializer_class = WorkerUpdateSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def get_queryset(self):
        task_id = self.request.query_params.get('task_id')
        if task_id:
            return WorkerUpdate.objects.filter(task_id=task_id)
        return WorkerUpdate.objects.all()

# Review and Support Views


class CustomerReviewViewSet(viewsets.ModelViewSet):
    queryset = CustomerReview.objects.all()
    serializer_class = CustomerReviewSerializer

    def get_queryset(self):
        queryset = CustomerReview.objects.all().order_by('-created_at')
        client_id = self.request.query_params.get('client_id')
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        return queryset


class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer

    def get_queryset(self):
        queryset = SupportTicket.objects.all().order_by('-created_at')
        client_id = self.request.query_params.get('client_id')
        status = self.request.query_params.get('status')
        
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Notification.objects.filter(user_id=user_id).order_by('-created_at')
        return Notification.objects.all().order_by('-created_at')
