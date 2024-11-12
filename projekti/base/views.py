from django.shortcuts import render, redirect
from .models import GroupMember
from django.http import HttpResponse

def home(request):

    return render(request, "base/index.html")

def registration(request):
    return render(request, "base/regestration.html")


def condiciones(request):
    return render(request, "base/condiciones.html")

def registration(request):
    if request.method == 'POST':
        group_name = request.POST.get('group_name')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        dni = request.POST.get('dni')
        email = request.POST.get('email')
        confirm_email = request.POST.get('confirm_email')
        phone = request.POST.get('phone')
        accept_conditions = request.POST.get('accept_conditions') == 'on'
        activity_date = request.POST.get('activity_date')
        num_persons = request.POST.get('num_persons')

        print(f"group_name: {group_name}, first_name: {first_name}, last_name: {last_name}, dni: {dni}, email: {email}, confirm_email: {confirm_email}, phone: {phone}, accept_conditions: {accept_conditions}")

        if email == confirm_email:
                GroupMember.objects.create(
                    group_name=group_name,
                    first_name=first_name,
                    last_name=last_name,
                    dni=dni,
                    email=email,
                    phone=phone,
                    accept_conditions=accept_conditions,
                    num_persons=num_persons,
                    activity_date=activity_date
                )
                return redirect('home')

    return render(request, 'base/regestration.html')


from django.urls import get_resolver

def print_urls(request):
    urls = get_resolver().url_patterns
    for url in urls:
        print(url)
    return HttpResponse("Check your console for URL patterns.")

