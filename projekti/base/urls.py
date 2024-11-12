from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("reserva/", views.registration, name="reserva"),
    path("condiciones/", views.condiciones, name="condiciones"),
]