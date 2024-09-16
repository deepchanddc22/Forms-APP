# adminform/urls.py

from django.urls import path
from .views import create_form
from .views import edit_form
from . import views

urlpatterns = [
    path('create/', create_form, name='create_form'),
    path('edit/<int:form_number>/', views.edit_form, name='edit_form'),
    path('delete/<int:form_number>/', views.delete_form, name='delete_form'),
]
