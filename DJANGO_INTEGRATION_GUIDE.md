# Django Template Integration Guide

## Phase 8: Connecting React to Django Templates

This guide explains how to integrate the new React + TypeScript frontend with the existing Django templates.

---

## 🎯 Overview

We've created **new React-enabled templates** that replace the old vanilla JavaScript implementation:

- **Old:** `floorplan_edit.html` → **New:** `floorplan_edit_react.html`
- **Old:** `floorplan_view.html` → **New:** `floorplan_view_react.html`

---

## 📁 Files Created

### New Template Files
```
netbox_floorplan/templates/netbox_floorplan/
├── floorplan_edit_react.html    # NEW: React-enabled editor
├── floorplan_view_react.html    # NEW: React-enabled viewer
├── floorplan_edit.html           # OLD: Keep as backup
└── floorplan_view.html           # OLD: Keep as backup
```

### React Build Files (Already Generated)
```
netbox_floorplan/static/netbox_floorplan/dist/
├── editor.js                     # Editor bundle (25KB)
├── viewer.js                     # Viewer bundle (2.9KB)
├── useExport-C1n6Q2cj.js        # Shared libraries (833KB)
├── html2canvas.esm-CBrSDip1.js  # Export library (198KB)
├── index.es-BPN9sKxc.js         # jsPDF library (147KB)
└── purify.es-C_uT9hQ1.js        # SVG sanitizer (21KB)
```

---

## 🔄 Migration Steps

### Step 1: Backup Original Templates

```bash
# Create backup directory
mkdir -p netbox_floorplan/templates/netbox_floorplan/backup

# Backup original templates
cp netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html \
   netbox_floorplan/templates/netbox_floorplan/backup/floorplan_edit.html.bak

cp netbox_floorplan/templates/netbox_floorplan/floorplan_view.html \
   netbox_floorplan/templates/netbox_floorplan/backup/floorplan_view.html.bak
```

### Step 2: Replace Templates

**Option A: Rename (Recommended for testing)**
```bash
# Rename old templates
mv netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html \
   netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html.old

mv netbox_floorplan/templates/netbox_floorplan/floorplan_view.html \
   netbox_floorplan/templates/netbox_floorplan/floorplan_view.html.old

# Rename new templates to active names
mv netbox_floorplan/templates/netbox_floorplan/floorplan_edit_react.html \
   netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html

mv netbox_floorplan/templates/netbox_floorplan/floorplan_view_react.html \
   netbox_floorplan/templates/netbox_floorplan/floorplan_view.html
```

**Option B: Direct replacement**
```bash
# Copy new templates over old ones
cp netbox_floorplan/templates/netbox_floorplan/floorplan_edit_react.html \
   netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html

cp netbox_floorplan/templates/netbox_floorplan/floorplan_view_react.html \
   netbox_floorplan/templates/netbox_floorplan/floorplan_view.html
```

### Step 3: Run Django collectstatic

```bash
# Collect static files (including React build)
python manage.py collectstatic --noinput

# Verify files were copied
ls -la static/netbox_floorplan/dist/
```

### Step 4: Restart NetBox

```bash
# Restart NetBox application
systemctl restart netbox
# OR for development
python manage.py runserver
```

### Step 5: Test the Integration

1. Navigate to a Site or Location in NetBox
2. Click the "Floor Plan" tab
3. Verify React app loads (you should see the new UI)
4. Test all features:
   - Add walls, areas, labels
   - Add racks and devices
   - Use zoom/pan controls
   - Export to various formats
   - Save floorplan

---

## 📋 Template Changes Summary

### `floorplan_edit_react.html`

**What Changed:**
- ✅ Removed all inline onclick handlers
- ✅ Removed HTMX includes and markup
- ✅ Removed jQuery dependency
- ✅ Removed old control panel HTML (React renders it)
- ✅ Removed old canvas markup (React renders it)
- ✅ Added data injection div with `data-*` attributes
- ✅ Added React app mount point (`#floorplan-editor-root`)
- ✅ Replaced old JS with React build (`editor.js`)

**What Stayed:**
- ✅ Django template extends and blocks
- ✅ Fabric.js vendor include (still required)
- ✅ Template structure and tabs
- ✅ CSRF token handling

**Data Injection:**
```html
<div id="floorplan-data"
     data-floorplan-id="{{ obj.pk }}"
     data-site-id="{% if site %}{{ site.id }}{% endif %}"
     data-location-id="{% if location %}{{ location.id }}{% endif %}"
     data-record-type="{{ record_type }}"
     data-csrf-token="{{ csrf_token }}"
     style="display: none;">
</div>
```

### `floorplan_view_react.html`

**What Changed:**
- ✅ Removed old canvas markup
- ✅ Removed jQuery dependency
- ✅ Removed old export button HTML (React renders it)
- ✅ Added data injection div
- ✅ Added React app mount point (`#floorplan-viewer-root`)
- ✅ Replaced old JS with React build (`viewer.js`)

**What Stayed:**
- ✅ Django template extends and blocks
- ✅ Fabric.js vendor include
- ✅ Breadcrumbs
- ✅ "Add Floorplan" button when no floorplan exists

---

## 🔍 Verification Checklist

After migration, verify:

- [ ] Templates load without errors
- [ ] React app initializes (check browser console)
- [ ] Canvas renders correctly
- [ ] Control panel appears on left side
- [ ] All buttons work (Add Wall, Add Rack, etc.)
- [ ] Zoom/pan controls function
- [ ] Export dialog opens and exports work
- [ ] Save button persists changes
- [ ] Rack/Device tables load from API
- [ ] Rulers and grid display correctly
- [ ] Physical dimension tooltips appear
- [ ] Viewer mode allows click-through navigation
- [ ] No JavaScript errors in console
- [ ] CSS styles applied correctly

---

## 🐛 Troubleshooting

### Issue: React App Not Loading

**Symptoms:**
- Blank page
- Console error: "Cannot read property 'dataset' of null"

**Solution:**
```html
<!-- Ensure data div exists BEFORE script tag -->
<div id="floorplan-data" data-floorplan-id="1"></div>
<div id="floorplan-editor-root"></div>
<script type="module" src="{% static 'netbox_floorplan/dist/editor.js' %}"></script>
```

### Issue: Static Files Not Found (404)

**Symptoms:**
- 404 errors for `editor.js`, `viewer.js`

**Solution:**
```bash
# Run collectstatic
python manage.py collectstatic --noinput

# Verify files exist
ls static/netbox_floorplan/dist/

# Check STATIC_URL and STATIC_ROOT in settings
```

### Issue: CSRF Token Errors

**Symptoms:**
- 403 Forbidden on API calls
- Console error: "CSRF token missing"

**Solution:**
```html
<!-- Ensure CSRF token is passed in data div -->
<div id="floorplan-data"
     data-csrf-token="{{ csrf_token }}">
</div>
```

### Issue: Fabric.js Not Found

**Symptoms:**
- Console error: "fabric is not defined"

**Solution:**
```html
<!-- Ensure Fabric.js loads BEFORE React app -->
<script src="{% static 'netbox_floorplan/vendors/fabric-js-6.0.2.js' %}"></script>
<script type="module" src="{% static 'netbox_floorplan/dist/editor.js' %}"></script>
```

### Issue: Old JavaScript Conflicts

**Symptoms:**
- Mixed behavior between old and new code
- Multiple instances of controls

**Solution:**
```bash
# Ensure old JS files are NOT loaded
# Check template - should NOT have:
<script src="{% static 'netbox_floorplan/floorplan/edit.js' %}"></script>
```

---

## 🔄 Rollback Procedure

If issues occur, rollback to old templates:

```bash
# Restore from backup
cp netbox_floorplan/templates/netbox_floorplan/backup/floorplan_edit.html.bak \
   netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html

cp netbox_floorplan/templates/netbox_floorplan/backup/floorplan_view.html.bak \
   netbox_floorplan/templates/netbox_floorplan/floorplan_view.html

# Restart NetBox
systemctl restart netbox
```

---

## 📊 Template Comparison

### Old Template (floorplan_edit.html)
```html
<!-- OLD: Inline controls, onclick handlers -->
<div class="col-md-4">
    <a onclick="add_wall()">Add Wall</a>
    <a onclick="add_area()">Add Area</a>
    <input type="color" oninput="set_color(this.value)">
</div>
<div class="col-md-8">
    <canvas id="canvas"></canvas>
</div>
<script src="{% static 'netbox_floorplan/floorplan/edit.js' %}"></script>
```

### New Template (floorplan_edit_react.html)
```html
<!-- NEW: React takes over, clean template -->
<div id="floorplan-data"
     data-floorplan-id="{{ obj.pk }}"
     data-csrf-token="{{ csrf_token }}">
</div>
<div id="floorplan-editor-root"></div>
<script type="module" src="{% static 'netbox_floorplan/dist/editor.js' %}"></script>
```

---

## 🎨 CSS Considerations

The React app uses **Bootstrap 5** classes that should already be available in NetBox:

- `btn`, `btn-primary`, `btn-outline-*`
- `card`, `card-header`, `card-body`
- `modal`, `modal-dialog`, `modal-content`
- `form-control`, `form-select`, `form-range`
- `nav`, `nav-tabs`, `tab-content`

If styles look incorrect, check NetBox's Bootstrap version.

---

## 🚀 Performance Notes

### Bundle Sizes
- **Editor**: ~25KB (initial load)
- **Viewer**: ~3KB (initial load)
- **Shared libraries**: ~833KB (loaded on demand for export)

### Code Splitting
Vite automatically splits large libraries:
- jsPDF loads only when export dialog opens
- html2canvas loads only when exporting to raster formats

### Caching
Static files should be cached by browser:
```python
# settings.py
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'
```

---

## 📝 API Endpoints Used

The React app makes API calls to:

```
GET  /api/plugins/floorplan/floorplans/?id={id}      # Load floorplan
PATCH /api/plugins/floorplan/floorplans/{id}/        # Save canvas
GET  /api/dcim/racks/?site_id={id}                   # List racks
GET  /api/dcim/devices/?site_id={id}&rack_id__isnull=true  # List devices
```

Ensure API permissions are configured correctly in NetBox.

---

## ✅ Success Criteria

You'll know the integration is successful when:

1. ✅ Page loads without errors
2. ✅ React UI appears with modern styling
3. ✅ All controls work (add, delete, color, zoom)
4. ✅ Canvas operations are smooth
5. ✅ Export produces valid files
6. ✅ Save persists to database
7. ✅ Viewer allows navigation
8. ✅ No console errors
9. ✅ Fast page load times
10. ✅ Responsive on different screen sizes

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify Django logs for backend errors
3. Ensure collectstatic ran successfully
4. Check file permissions on dist/ directory
5. Verify NetBox version compatibility (4.4-4.5)

---

## 🎉 Benefits of New Architecture

- ✅ **Modern Framework**: React + TypeScript
- ✅ **Type Safety**: Fewer runtime errors
- ✅ **Better UX**: Smooth interactions, no page reloads
- ✅ **Maintainable**: Component-based architecture
- ✅ **Feature-Rich**: Scaling, rulers, multi-format export
- ✅ **Fast**: Code splitting, optimized bundles
- ✅ **Professional**: Industry-standard tools

Enjoy your upgraded NetBox Floorplan Plugin! 🚀
