# adminform/models.py

from django.db import models
from django.utils.translation import gettext_lazy as _

class Question(models.Model):
    QUESTION_TYPE_CHOICES = [
        ('custom', 'Custom'),
        ('dropdown', 'Dropdown'),
        ('text', 'Text'),
    ]
    
    question_number = models.IntegerField(default=0)
    question_text = models.CharField(max_length=255)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES)
    options = models.JSONField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Automatically set question_number here if needed
        if not self.pk:
            last_question = Question.objects.all().order_by('-question_number').first()
            self.question_number = last_question.question_number + 1 if last_question else 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.question_text
