from rest_framework import serializers
from .models import User, CustomerProfile, Installation, Booking, Bill, UsageTelemetry, WorkerAttendance, SubWorkerProfile, TeamTask, BookingDocument, WorkerUpdate, CustomerReview

class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['address', 'phone']

class SubWorkerProfileSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source='agent.username', read_only=True)
    
    class Meta:
        model = SubWorkerProfile
        fields = ['job_title', 'agent', 'agent_name']

class UserSerializer(serializers.ModelSerializer):
    customer_profile = CustomerProfileSerializer(read_only=True)
    subworker_profile = SubWorkerProfileSerializer(read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    
    # Used for agent assigning sub worker during registration
    agent_id = serializers.IntegerField(write_only=True, required=False)
    job_title = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name', 'password', 'customer_profile', 'subworker_profile', 'agent_id', 'job_title', 'date_joined']

    def create(self, validated_data):
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
                SubWorkerProfile.objects.create(user=user, agent=agent, job_title=job_title)
                print(f"SubWorkerProfile created for {user.username} under Agent ID: {agent_id}")
            except User.DoesNotExist:
                print(f"Failed to create SubWorkerProfile: Agent ID {agent_id} does not exist.")
                pass
                
        return user

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
