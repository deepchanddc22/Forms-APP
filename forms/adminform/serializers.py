# adminform/serializers.py

from rest_framework import serializers

class QuestionSerializer(serializers.Serializer):
    question_number = serializers.IntegerField()
    question_text = serializers.CharField()
    question_type = serializers.ChoiceField(choices=['custom', 'dropdown', 'text'])
    options = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True
    )
    
class FormSerializer(serializers.Serializer):
    questions = QuestionSerializer(many=True)
