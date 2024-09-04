from django.conf import settings
from django.http import Http404, JsonResponse
from django.utils.deprecation import MiddlewareMixin


class JsonResponseErrorMiddleware(MiddlewareMixin):
    def process_exception(self, _, exception):
        if not getattr(settings, "DEBUG", False):
            status_code = getattr(exception, "status_code", 500)
            if isinstance(exception, Http404):
                status_code = 404

            # Create a response object
            response_data = {
                "error": str(exception),
                "status_code": status_code,
            }
            return JsonResponse(response_data, status=status_code)
