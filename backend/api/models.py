from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('agent', 'Agent'),
        ('customer', 'Customer'),
        ('sub_worker', 'Sub Worker'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - Profile"

class AgentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='agent_profile')
    phone = models.CharField(max_length=20, blank=True, null=True, default="Pending Assignment")
    address = models.TextField(blank=True, null=True, default="HQ Base Deployment")
    status = models.CharField(max_length=20, default="ON DUTY")
    profile_photo = models.ImageField(upload_to='agent_profiles/', blank=True, null=True)

    def __str__(self):
        return f"Agent {self.user.username} Profile"

class Installation(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Follow Up', 'Follow Up'),
    )
    system = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_installations', limit_choices_to={'role': 'customer'})
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_installations', limit_choices_to={'role': 'agent'})
    sub_worker = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='field_installations', limit_choices_to={'role': 'sub_worker'})
    date = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.system} for {self.client.username}"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted by Agent'),
        ('Awaiting Admin', 'Awaiting Admin Configuration'),
        ('Loan Approved', 'Loan Approved by Admin'),
        ('Loan Rejected', 'Loan Rejected'),
        ('Direct Pay Confirmed', 'Direct Pay Confirmed'),
        ('Dispatched', 'Dispatched to Worker'),
        ('Completed', 'Installation Completed')
    )
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_bookings')
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='agent_bookings', limit_choices_to={'role': 'agent'})
    
    # Form Details
    client_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    requested_date = models.DateField(blank=True, null=True)
    requested_time = models.TimeField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    # Agent Action
    confirmed_date = models.DateField(null=True, blank=True)
    confirmed_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"Booking by {self.client_name} - {self.status}"

class Bill(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bills')
    bill_no = models.CharField(max_length=20, unique=True)
    date = models.DateField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    units = models.IntegerField(default=0)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    loan = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    subsidy = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    downpayment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=(('Paid', 'Paid'), ('Unpaid', 'Unpaid')), default='Unpaid')

    def __str__(self):
        return f"Bill {self.bill_no} for {self.client.username}"

class UsageTelemetry(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='telemetry')
    timestamp = models.DateTimeField(auto_now_add=True)
    monthly_avg = models.IntegerField(default=120)
    total_units = models.IntegerField(default=350)
    efficiency = models.IntegerField(default=85)

    def __str__(self):
        return f"Telemetry for {self.client.username}"

class WorkerAttendance(models.Model):
    STATUS_CHOICES = (
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('On Leave', 'On Leave'),
        ('Shift Ended', 'Shift Ended'),
    )
    worker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Present')
    punch_in_time = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    punch_out_time = models.DateTimeField(null=True, blank=True)

    # Ensure a worker only has one attendance record per day.
    class Meta:
        unique_together = ('worker', 'date')

    def __str__(self):
        return f"{self.worker.username} - {self.date} - {self.status}"

class SubWorkerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subworker_profile')
    agent = models.ForeignKey(User, related_name='my_team', on_delete=models.CASCADE, limit_choices_to={'role': 'agent'})
    job_title = models.CharField(max_length=20, choices=(('technician', 'Technician'), ('worker', 'Worker')))
    raw_password = models.CharField(max_length=100, blank=True, null=True, default="pass123!")
    
    # New Personal Details
    phone = models.CharField(max_length=20, blank=True, null=True, default="Not Provided")
    address = models.TextField(blank=True, null=True, default="No Address Linked")
    experience = models.CharField(max_length=50, blank=True, null=True, default="Junior")
    
    def __str__(self):
        return f"{self.user.username} ({self.job_title}) under {self.agent.username}"

class TeamTask(models.Model):
    STATUS_CHOICES = (
        ('Dispatched', 'Dispatched'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    )
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='team_tasks')
    agent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dispatched_tasks', limit_choices_to={'role': 'agent'})
    sub_worker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks', limit_choices_to={'role': 'sub_worker'})
    location_link = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Dispatched')
    dispatched_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Task for {self.sub_worker.username} at {self.booking.address}"

class BookingDocument(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='documents')
    
    # Financial/Verification Documents
    current_bill = models.FileField(upload_to='booking_docs/bills/', blank=True, null=True)
    aadhar_card = models.FileField(upload_to='booking_docs/aadhar/', blank=True, null=True)
    pan_card = models.FileField(upload_to='booking_docs/pan/', blank=True, null=True)
    bank_details = models.FileField(upload_to='booking_docs/bank/', blank=True, null=True)
    house_tax = models.FileField(upload_to='booking_docs/tax/', blank=True, null=True)
    bank_statement_6m = models.FileField(upload_to='booking_docs/statements/', blank=True, null=True)
    
    # Hardware Requirements
    panel_type = models.CharField(max_length=50, blank=True, null=True)
    capacity = models.CharField(max_length=50, blank=True, null=True)
    wire_type = models.CharField(max_length=50, blank=True, null=True)
    battery_type = models.CharField(max_length=50, blank=True, null=True)
    inverter_type = models.CharField(max_length=50, blank=True, null=True)
    rod_type = models.CharField(max_length=50, blank=True, null=True)
    rod_count = models.IntegerField(default=0)
    panel_count = models.IntegerField(default=0)

    # Final Stage Document (Uploaded by Admin)
    final_invoice = models.FileField(upload_to='invoices/', blank=True, null=True)
    
    def __str__(self):
        return f"Documents & Specs for Booking {self.booking.id}"

class WorkerUpdate(models.Model):
    task = models.ForeignKey(TeamTask, on_delete=models.CASCADE, related_name='updates')
    description = models.TextField()
    photo = models.ImageField(upload_to='worker_updates/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Update by {self.task.sub_worker.username} at {self.timestamp}"

class CustomerReview(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.client.username} - {self.rating} Stars"
class SupportTicket(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Resolved', 'Resolved'),
        ('Dispatched', 'Dispatched'),
    )
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    ticket_no = models.CharField(max_length=20, unique=True)
    type = models.CharField(max_length=50) # Technical, Billing, General
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    assigned_worker = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets', limit_choices_to={'role': 'sub_worker'})
    
    # Resolution Data
    resolution_photo = models.FileField(upload_to='support_resolutions/', blank=True, null=True)
    materials_used = models.TextField(blank=True, null=True, help_text="Materials used during intervention")

    def __str__(self):
        return f"{self.ticket_no} - {self.client.username}"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"
