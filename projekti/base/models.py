from django.db import models

class DatePlazas(models.Model):
    date = models.DateField(unique=True)
    plazas = models.IntegerField(default=90)  # Default value

    def str(self):
        return f"{self.date}: {self.plazas} plazas"

class GroupMember(models.Model):
    group_name = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    dni = models.CharField(max_length=9, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    accept_conditions = models.BooleanField(default=False)
    activity_date = models.TextField(null=True, blank=True)  # or models.TextField() if you want to keep it as text
    num_persons = models.IntegerField(null=True, blank=True)

    def str(self):
        return f"{self.first_name} {self.last_name}"