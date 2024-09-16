from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework_simplejwt.tokens import AccessToken
import json
import os

from .models import Question

@csrf_exempt
@require_http_methods(["POST"])
def create_form(request):
    try:
        # Check authorization header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Unauthorized'}, status=401)

        # Extract and verify token
        token = auth_header.split(' ')[1]
        try:
            access_token = AccessToken(token)  # Verify the token
            employee_id = access_token.get('employee_id')  # Extract employee_id from the token
            if not employee_id:
                return JsonResponse({'error': 'Invalid token: Employee ID missing'}, status=401)
        except Exception as e:
            return JsonResponse({'error': f'Invalid token: {str(e)}'}, status=401)

        # Parse JSON data
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        questions = data.get('questions', [])
        if not questions:
            return JsonResponse({'error': 'No questions provided'}, status=400)

        # Prepare to save questions to the database
        all_questions = []  # Collect questions to write to JSON file later

        for index, question in enumerate(questions):
            question_text = question.get('question_text')
            question_type = question.get('question_type')
            options = question.get('options', [])

            if not question_text or not question_type:
                return JsonResponse({'error': 'Invalid question format'}, status=400)
            
            if question_type not in ['custom', 'dropdown', 'text']:
                return JsonResponse({'error': 'Invalid question type'}, status=400)
            
            if question_type in ['custom', 'dropdown'] and not options:
                return JsonResponse({'error': 'Options required for custom and dropdown questions'}, status=400)

            # Save each question to the database with a new question_number starting from 1
            question_obj = Question(
                question_number=index + 1,  # Start numbering from 1
                question_text=question_text,
                question_type=question_type,
                options=options
            )
            question_obj.save()

            # Append question to the list to be written to JSON
            all_questions.append({
                'question_number': index + 1,  # Start numbering from 1
                'question_text': question_text,
                'question_type': question_type,
                'options': options
            })

        # Create the folder structure: data/{employee_id}
        base_dir = os.path.join(os.path.dirname(__file__), 'data', str(employee_id))
        os.makedirs(base_dir, exist_ok=True)

        # Determine the next form number for this employee_id (by counting existing files)
        existing_files = [f for f in os.listdir(base_dir) if f.startswith(f'form{employee_id}_') and f.endswith('.json')]
        form_number = len(existing_files) + 1

        # Save the form as a JSON file named form{employee_id}_{form_number}.json
        json_file_path = os.path.join(base_dir, f'form{employee_id}_{form_number}.json')
        try:
            with open(json_file_path, 'w') as json_file:
                json.dump(all_questions, json_file, indent=4)
        except IOError as e:
            return JsonResponse({'error': f'Failed to save questions: {str(e)}'}, status=500)

        return JsonResponse({'message': 'Questions added successfully', 'form_number': form_number}, status=201)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
def edit_form(request, form_number):  # form_number is captured from URL
    try:
        # Check authorization header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Unauthorized'}, status=401)

        # Extract and verify token
        token = auth_header.split(' ')[1]
        try:
            access_token = AccessToken(token)
            employee_id = access_token.get('employee_id')
            if not employee_id:
                return JsonResponse({'error': 'Invalid token: Employee ID missing'}, status=401)
        except Exception as e:
            return JsonResponse({'error': f'Invalid token: {str(e)}'}, status=401)

        # Parse JSON data
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        questions = data.get('questions', [])
        if not questions:
            return JsonResponse({'error': 'No questions provided'}, status=400)

        # File path for the form JSON
        base_dir = os.path.join(os.path.dirname(__file__), 'data', str(employee_id))
        json_file_path = os.path.join(base_dir, f'form{employee_id}_{form_number}.json')

        if not os.path.exists(json_file_path):
            return JsonResponse({'error': 'Form not found'}, status=404)

        # Overwrite the form with the updated questions
        try:
            with open(json_file_path, 'w') as json_file:
                json.dump(questions, json_file, indent=4)
        except IOError as e:
            return JsonResponse({'error': f'Failed to save questions: {str(e)}'}, status=500)

        return JsonResponse({'message': 'Form edited successfully'}, status=200)

    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
    



@csrf_exempt
@require_http_methods(["DELETE"])
def delete_form(request, form_number):
    try:
        # Check authorization header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Unauthorized'}, status=401)

        # Extract and verify token
        token = auth_header.split(' ')[1]
        try:
            access_token = AccessToken(token)
            employee_id = access_token.get('employee_id')
            if not employee_id:
                return JsonResponse({'error': 'Invalid token: Employee ID missing'}, status=401)
        except Exception as e:
            return JsonResponse({'error': f'Invalid token: {str(e)}'}, status=401)

        # File path for the form JSON
        base_dir = os.path.join(os.path.dirname(__file__), 'data', str(employee_id))
        json_file_path = os.path.join(base_dir, f'form{employee_id}_{form_number}.json')

        # Check if the form exists
        if not os.path.exists(json_file_path):
            return JsonResponse({'error': 'Form not found'}, status=404)

        # Attempt to delete the form
        try:
            os.remove(json_file_path)
        except OSError as e:
            return JsonResponse({'error': f'Failed to delete form: {str(e)}'}, status=500)

        return JsonResponse({'message': 'Form deleted successfully'}, status=200)

    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
