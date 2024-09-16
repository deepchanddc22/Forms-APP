from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import CustomUser
import re
from rest_framework_simplejwt.tokens import RefreshToken

@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    try:
        # Get employee_id and password from request and remove trailing spaces
        employee_id = request.POST.get('employee_id', '').strip()
        password = request.POST.get('password', '').strip()

        # Validate employee_id (must be an integer)
        if not employee_id or not employee_id.isdigit():
            return JsonResponse({'error': 'Employee ID must be a number.'}, status=400)

        # Validate password (must be alphanumeric and may include special characters)
        if not password or len(password) < 8:  # Example: password must be at least 8 characters long
            return JsonResponse({'error': 'Password must be at least 8 characters long.'}, status=400)

        # Optional: Use regex to allow specific characters or patterns if needed
        if not re.match(r'^[\w@#$%^&+=]*$', password):  # Allows alphanumeric and specific special characters
            return JsonResponse({'error': 'Password contains invalid characters.'}, status=400)

        # Check if the employee ID already exists
        if CustomUser.objects.filter(employee_id=employee_id).exists():
            return JsonResponse({'error': 'Employee ID already exists. Please login.'}, status=400)

        # Create user
        user = CustomUser.objects.create_user(username=employee_id, password=password, employee_id=employee_id)
        return JsonResponse({'message': 'User created successfully'}, status=201)

    except Exception as e:
        # Log the exception or print it for debugging purposes
        print(f"An error occurred: {e}")
        return JsonResponse({'error': 'An unexpected error occurred. Please try again later.'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    try:
        employee_id = request.POST.get('employee_id', '').strip()
        password = request.POST.get('password', '').strip()

        if not employee_id or not password:
            return JsonResponse({'error': 'Employee ID and password are required'}, status=400)

        user = authenticate(username=employee_id, password=password)

        if user is not None:
            login(request, user)

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            # Add employee_id to the token payload
            refresh['employee_id'] = employee_id
            access_token = str(refresh.access_token)

            return JsonResponse({'message': 'Login successful', 'access_token': access_token}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

    except Exception as e:
        print(f"An error occurred during login: {e}")
        return JsonResponse({'error': 'An unexpected error occurred. Please try again later.'}, status=500)