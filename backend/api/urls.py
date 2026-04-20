from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'installations', views.InstallationViewSet)
router.register(r'bookings', views.BookingViewSet)
router.register(r'bills', views.BillViewSet)
router.register(r'telemetry', views.UsageTelemetryViewSet)
router.register(r'attendance', views.WorkerAttendanceViewSet)
router.register(r'teamtasks', views.TeamTaskViewSet)
router.register(r'bookingdocs', views.BookingDocumentViewSet)
router.register(r'workerupdates', views.WorkerUpdateViewSet)
router.register(r'reviews', views.CustomerReviewViewSet)
router.register(r'agentprofiles', views.AgentProfileViewSet)
router.register(r'support-tickets', views.SupportTicketViewSet)
router.register(r'notifications', views.NotificationViewSet)

urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/oauth/', views.oauth_login_view, name='oauth_login'),
    path('agent/update-profile/', views.update_agent_profile, name='update_agent_profile'),
    path('', include(router.urls)),
]
