def file_upload(instance, filename):
    """
    Return a path for uploading image attchments.
    Adapted from netbox/extras/utils.py
    """
    path = 'netbox-floorplan/'

    if hasattr(instance, 'site'):
        if instance.site is not None:
            path_prepend = instance.site.id
    elif hasattr(instance, 'location'):
        if instance.location is not None:
            path_prepend = instance.location.id
    try:
    	return f'{path}{path_prepend}_{filename}'
    except:
	    return f'{path}{filename}'
