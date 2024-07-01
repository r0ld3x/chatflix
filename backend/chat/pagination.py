from math import ceil

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class MyCustomPagination(PageNumberPagination):
    # Default page size and the maximum limit for safety
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50
    page_query_param = "page"  # Default page query parameter

    def get_paginated_response(self, data):
        """
        Customize the paginated response to include additional metadata.
        """
        total_count = self.page.paginator.count
        total_pages = ceil(total_count / self.page_size)
        current_page = (
            self.page.number
        )  # DRF's `PageNumberPagination` provides the page object

        return Response(
            {
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "total_count": total_count,
                "total_pages": total_pages,
                "current_page": current_page,
                "page_size": self.page_size,  # Reflect the current limit
                "results": data,
            }
        )

    def get_next_link(self):
        """
        Generate the 'next' link based on the current page number and total pages.
        """
        if self.page.has_next():
            next_page_number = self.page.next_page_number()
            return self._create_page_link(next_page_number)
        return None

    def get_previous_link(self):
        """
        Generate the 'previous' link based on the current page number.
        """
        if self.page.has_previous():
            previous_page_number = self.page.previous_page_number()
            return self._create_page_link(previous_page_number)
        return None

    def _create_page_link(self, page_number):
        """
        Helper function to create pagination links with page numbers.
        """
        base_url = self.request.build_absolute_uri()  # Get the full current URL
        # Preserve other query parameters while changing the page parameter
        url = base_url.split("?")[0]  # Remove existing query parameters
        return f"{url}?{self.page_query_param}={page_number}&page_size={self.page_size}"  # Page and page_size
