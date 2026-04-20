from rest_framework import serializers
from .models import User, CustomerProfile, AgentProfile, Installation, Booking, Bill, UsageTelemetry, WorkerAttendance, SubWorkerProfile, TeamTask, BookingDocument, WorkerUpdate, CustomerReview, SupportTicket

class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['address', 'phone']

class AgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        fields = ['phone', 'address', 'status', 'profile_photo']

class SubWorkerProfileSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source='agent.username', read_only=True)
    
    class Meta:
        model = SubWorkerProfile
        fields = ['job_title', 'agent', 'agent_name', 'raw_password', 'phone', 'address', 'experience']

class UserSerializer(serializers.ModelSerializer):
    customer_profile = CustomerProfileSerializer(read_only=True)
    subworker_profile = SubWorkerProfileSerializer(read_only=True)
    agent_profile = AgentProfileSerializer(read_only=True)
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False)
    
    # Used for agent assigning sub worker during registration
    agent_id = serializers.IntegerField(write_only=True, required=False)
    job_title = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name', 'password', 'customer_profile', 'subworker_profile', 'agent_profile', 'agent_id', 'job_title', 'date_joined']

    def create(self, validated_data):
        email = validated_data.get('email')
        if not validated_data.get('username'):
            validated_data['username'] = email
            
        password = validated_data.pop('password', 'default123')
        role = validated_data.pop('role', 'customer')
        agent_id = validated_data.pop('agent_id', None)
        job_title = validated_data.pop('job_title', 'worker')
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.role = role
        user.save()
        
        if role == 'sub_worker' and agent_id:
            try:
                agent = User.objects.get(id=agent_id)
                SubWorkerProfile.objects.create(user=user, agent=agent, job_title=job_title, raw_password=password)
                print(f"SubWorkerProfile created for {user.username}")
            except User.DoesNotExist:
                print(f"Failed to create SubWorkerProfile: Agent ID {agent_id} does not exist.")
        
        elif role == 'customer':
            CustomerProfile.objects.create(user=user)
            print(f"CustomerProfile created for {user.username}")
            
        elif role == 'agent':
            AgentProfile.objects.create(user=user)
            print(f"AgentProfile created for {user.username}")
                
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
            # Sync raw_password if subworker
            if hasattr(instance, 'subworker_profile'):
                instance.subworker_profile.raw_password = password
                instance.subworker_profile.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class InstallationSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
    agent_name = serializers.CharField(source='agent.username', read_only=True)

    class Meta:
        model = Installation
        fields = ['id', 'system', 'status', 'client', 'client_name', 'agent', 'agent_name', 'date', 'location']

class BookingDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingDocument
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(source='client.username', read_only=True)
    agent_username = serializers.CharField(source='agent.username', read_only=True)
    documents = BookingDocumentSerializer(read_only=True)
    team_tasks = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = '__all__'

    def get_team_tasks(self, obj):
        return [
            {
                'id': task.id,
                'sub_worker_name': task.sub_worker.username,
                'status': task.status,
                'location_link': task.location_link,
                'updates': [
                    {
                        'description': update.description,
                        'photo': update.photo.url if update.photo else None,
                        'timestamp': update.timestamp
                    }
                    for update in task.updates.all()
                ]
            }
            for task in obj.team_tasks.all()
        ]

class BillSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)

    class Meta:
        model = Bill
        fields = ['id', 'client', 'client_name', 'bill_no', 'date', 'paid_at', 'units', 'amount', 'loan', 'subsidy', 'downpayment', 'status']

class UsageTelemetrySerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageTelemetry
        fields = '__all__'

class WorkerAttendanceSerializer(serializers.ModelSerializer):
    worker_name = serializers.CharField(source='worker.username', read_only=True)
    class Meta:
        model = WorkerAttendance
        fields = ['id', 'worker', 'worker_name', 'date', 'status', 'punch_in_time', 'punch_out_time']

class WorkerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerUpdate
        fields = '__all__'

class TeamTaskSerializer(serializers.ModelSerializer):
    sub_worker_name = serializers.CharField(source='sub_worker.username', read_only=True)
    agent_name = serializers.CharField(source='agent.username', read_only=True)
    address = serializers.CharField(source='booking.address', read_only=True)
    booking_details = BookingSerializer(source='booking', read_only=True)
    updates = WorkerUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = TeamTask
        fields = '__all__'

class CustomerReviewSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
    class Meta:
        model = CustomerReview
        fields = '__all__'

class SupportTicketSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    assigned_worker_name = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicket
        fields = ['id', 'client', 'client_name', 'ticket_no', 'type', 'description', 'status', 'created_at', 'resolved_at', 'assigned_worker', 'assigned_worker_name']

    def get_client_name(self, obj):
        return obj.client.username if obj.client else "Unknown"

    def get_assigned_worker_name(self, obj):
        return obj.assigned_worker.username if obj.assigned_worker else "Not Assigned"
