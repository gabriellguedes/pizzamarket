from django.urls import path
from .views import RegisterView, UserDetailView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='account_register'),
    path('user/', UserDetailView.as_view(), name='account_user_detail'),
    path('logout/', LogoutView.as_view(), name='account_logout'),
]