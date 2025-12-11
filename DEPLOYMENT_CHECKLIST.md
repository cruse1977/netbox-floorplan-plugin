# Deployment Checklist - React Migration

## Quick Deployment Steps

Follow these steps to deploy the new React-based frontend:

---

## ✅ Pre-Deployment

- [ ] **Backup database**
  ```bash
  python manage.py dumpdata netbox_floorplan > floorplan_backup.json
  ```

- [ ] **Backup old templates**
  ```bash
  mkdir -p netbox_floorplan/templates/netbox_floorplan/backup
  cp netbox_floorplan/templates/netbox_floorplan/*.html \
     netbox_floorplan/templates/netbox_floorplan/backup/
  ```

- [ ] **Verify Node.js and npm installed** (for rebuilding if needed)
  ```bash
  node --version  # Should be 18+
  npm --version
  ```

- [ ] **Review current floorplan data**
  - Count existing floorplans: `SELECT COUNT(*) FROM netbox_floorplan_floorplan;`
  - Test one floorplan in current system
  - Take screenshots for comparison

---

## 🚀 Deployment

### 1. Replace Templates

```bash
cd /path/to/netbox-floorplan-plugin

# Option A: Rename (keeps old as .old)
mv netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html \
   netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html.old

mv netbox_floorplan/templates/netbox_floorplan/floorplan_view.html \
   netbox_floorplan/templates/netbox_floorplan/floorplan_view.html.old

mv netbox_floorplan/templates/netbox_floorplan/floorplan_edit_react.html \
   netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html

mv netbox_floorplan/templates/netbox_floorplan/floorplan_view_react.html \
   netbox_floorplan/templates/netbox_floorplan/floorplan_view.html
```

### 2. Collect Static Files

```bash
# Run Django collectstatic
python manage.py collectstatic --noinput

# Verify files copied
ls -la static/netbox_floorplan/dist/
# Should see: editor.js, viewer.js, useExport-*.js, etc.
```

### 3. Restart NetBox

```bash
# For systemd
sudo systemctl restart netbox netbox-rq

# For development
python manage.py runserver
```

### 4. Clear Browser Cache

- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or open in incognito/private mode

---

## ✅ Post-Deployment Testing

### Quick Smoke Test (5 minutes)

- [ ] **Page loads without errors**
  - Navigate to Site → Floor Plan tab
  - Check browser console (F12) for errors

- [ ] **UI renders correctly**
  - Control panel on left
  - Canvas on right
  - Rulers visible (if dimensions set)

- [ ] **Basic operations work**
  - Click "Add Wall" → Wall appears
  - Drag wall → Moves
  - Delete wall → Removed
  - Click "Save" → Success message

### Full Feature Test (15 minutes)

**Editor Functions:**
- [ ] Set dimensions (50ft × 30ft)
- [ ] Rulers appear with correct scale
- [ ] Grid overlay displays
- [ ] Add wall, area, label
- [ ] Add simple rack from table
- [ ] Add advanced device from table
- [ ] Change object color
- [ ] Change text color
- [ ] Toggle status/role/tenant visibility
- [ ] Use zoom slider
- [ ] Pan with Alt+drag
- [ ] Move object with arrow keys
- [ ] Rotate with Shift+arrows
- [ ] Delete with Delete key
- [ ] Lock/unlock object
- [ ] Layer controls (forward/back)
- [ ] Export to SVG
- [ ] Export to PNG
- [ ] Export to JPEG
- [ ] Export to PDF
- [ ] Save floorplan

**Viewer Functions:**
- [ ] Navigate to Site → Floor Plan
- [ ] Canvas displays correctly
- [ ] Click rack → Navigates to rack detail
- [ ] Zoom/pan works
- [ ] Export button works
- [ ] Edit button navigates to editor

### API Integration Test (5 minutes)

- [ ] **Load floorplan**
  ```bash
  curl -H "Authorization: Token YOUR_TOKEN" \
    http://localhost:8000/api/plugins/floorplan/floorplans/1/
  ```

- [ ] **Save changes persist**
  - Make change in editor
  - Click Save
  - Reload page → Change still there

- [ ] **Racks load from NetBox**
  - Check rack table populates
  - Verify rack count matches NetBox

### Performance Test (3 minutes)

- [ ] **Initial page load** < 2 seconds
- [ ] **Canvas operations** smooth (60 FPS)
- [ ] **Large floorplans** (50+ objects) render quickly
- [ ] **Export operations** complete within 5 seconds

---

## 🐛 Common Issues & Fixes

### Issue: Blank Page

**Check:**
```bash
# Browser console - should NOT see:
"Cannot read property 'dataset' of null"
"Module not found: editor.js"

# If you see these errors:
python manage.py collectstatic --noinput
sudo systemctl restart netbox
```

### Issue: 404 on Static Files

**Check:**
```bash
# Verify files exist
ls static/netbox_floorplan/dist/

# Check Django settings
python manage.py diffsettings | grep STATIC

# If missing, run collectstatic
python manage.py collectstatic --noinput
```

### Issue: CSRF Token Errors

**Check:**
```bash
# Browser console - should NOT see:
"403 Forbidden"
"CSRF token missing"

# Template should have:
data-csrf-token="{{ csrf_token }}"
```

### Issue: Canvas Not Rendering

**Check:**
```bash
# Browser console - should NOT see:
"fabric is not defined"

# Template should load Fabric.js BEFORE React:
<script src="{% static 'netbox_floorplan/vendors/fabric-js-6.0.2.js' %}"></script>
<script src="{% static 'netbox_floorplan/dist/editor.js' %}"></script>
```

---

## 🔄 Rollback (If Needed)

```bash
# Restore old templates
cp netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html.old \
   netbox_floorplan/templates/netbox_floorplan/floorplan_edit.html

cp netbox_floorplan/templates/netbox_floorplan/floorplan_view.html.old \
   netbox_floorplan/templates/netbox_floorplan/floorplan_view.html

# Restart NetBox
sudo systemctl restart netbox

# Verify old version loads
# Navigate to Floor Plan tab - should see old UI
```

---

## 📊 Success Metrics

After 24 hours of deployment:

- [ ] Zero JavaScript errors in logs
- [ ] All floorplans load successfully
- [ ] Save operations succeed
- [ ] Export operations succeed
- [ ] No user complaints
- [ ] Page load times acceptable
- [ ] Mobile/tablet users can view (if applicable)

---

## 📝 Documentation Updates

After successful deployment:

- [ ] Update user documentation with new UI screenshots
- [ ] Document new export formats (PNG, JPEG, PDF)
- [ ] Document scaling/ruler features
- [ ] Update keyboard shortcuts guide
- [ ] Note any breaking changes
- [ ] Update version number in `__init__.py`

---

## 🎉 Deployment Complete!

Once all checkboxes are marked:

1. ✅ Announce to users
2. ✅ Monitor for 48 hours
3. ✅ Delete .old backup files (after 1 week)
4. ✅ Update changelog
5. ✅ Celebrate! 🎊

---

## 📞 Emergency Contacts

If critical issues arise:

- **Database Backup Location**: `/backups/netbox/`
- **Log Files**: `/var/log/netbox/`
- **Rollback Time Estimate**: 5 minutes
- **Expected Downtime**: < 1 minute

---

## 🔒 Security Notes

- ✅ React app uses Django CSRF tokens
- ✅ API calls include authentication
- ✅ No inline scripts (CSP-compliant)
- ✅ DOMPurify sanitizes SVG exports
- ✅ No eval() or dangerous functions

---

## 💡 Tips

1. **Deploy during low-traffic hours**
2. **Test in staging environment first**
3. **Have rollback plan ready**
4. **Monitor logs during deployment**
5. **Keep old templates for 1 week minimum**
6. **Document any custom modifications**
7. **Test on multiple browsers** (Chrome, Firefox, Safari, Edge)

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Rollback Plan Verified:** ☐ Yes ☐ No
**Backup Created:** ☐ Yes ☐ No
**Success:** ☐ Yes ☐ No
