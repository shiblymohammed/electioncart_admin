# Dynamic Resources System - Complete Explanation

## Overview
Yes, the resources are **dynamically matched** to each product (Campaign or Package) in the order. Each product can have its own unique set of resource fields that customers need to fill.

## How It Works

### 1. **Product Configuration (Admin Side)**

When an admin creates or edits a Campaign or Package, they can define custom resource fields:

```
Campaign: "Social Media Campaign"
├── Resource Fields:
│   ├── Candidate Photo (Image, Required)
│   ├── Party Logo (Image, Required)
│   ├── Campaign Slogan (Text, Required)
│   ├── WhatsApp Number (Phone, Required)
│   ├── Preferred Launch Date (Date, Optional)
│   └── Additional Notes (Text, Optional)
```

```
Package: "Election Starter Pack"
├── Resource Fields:
│   ├── Candidate Photo (Image, Required)
│   ├── Party Symbol (Image, Required)
│   ├── Manifesto Document (Document, Optional)
│   └── Contact Number (Phone, Required)
```

### 2. **Database Structure**

#### ResourceFieldDefinition Model
```python
class ResourceFieldDefinition(models.Model):
    content_type = ForeignKey(ContentType)  # Links to Campaign or Package
    object_id = PositiveIntegerField()      # Specific product ID
    product = GenericForeignKey()           # The actual product
    
    field_name = CharField()                # "Candidate Photo"
    field_type = CharField()                # "image", "text", "document", etc.
    is_required = BooleanField()            # Is this field mandatory?
    order = IntegerField()                  # Display order
    help_text = CharField()                 # Instructions for user
    
    # Field-specific configurations
    max_file_size_mb = IntegerField()       # For images/documents
    max_length = IntegerField()             # For text fields
    allowed_extensions = JSONField()        # For documents
```

#### DynamicResourceSubmission Model
```python
class DynamicResourceSubmission(models.Model):
    order_item = ForeignKey(OrderItem)              # Links to specific order item
    field_definition = ForeignKey(ResourceFieldDefinition)  # Which field
    
    # Different value types
    text_value = TextField()                # For text, phone, date
    number_value = IntegerField()           # For numbers
    file_value = FileField()                # For images, documents
    
    uploaded_at = DateTimeField()
```

### 3. **Order Flow**

#### Step 1: Customer Places Order
```
Order #12345
├── Item 1: Social Media Campaign (Qty: 1)
│   └── Requires: 6 resource fields
└── Item 2: Election Starter Pack (Qty: 1)
    └── Requires: 4 resource fields
```

#### Step 2: System Fetches Required Fields
When customer views order details, the API:
1. Gets all order items
2. For each item, finds its product (Campaign/Package)
3. Fetches all ResourceFieldDefinitions for that product
4. Returns the fields grouped by order item

**API Response:**
```json
{
  "order_id": 12345,
  "items": [
    {
      "order_item_id": 1,
      "item_type": "campaign",
      "item_name": "Social Media Campaign",
      "fields": [
        {
          "id": 10,
          "field_name": "Candidate Photo",
          "field_type": "image",
          "is_required": true,
          "submitted": false
        },
        {
          "id": 11,
          "field_name": "Campaign Slogan",
          "field_type": "text",
          "is_required": true,
          "submitted": false
        }
      ]
    },
    {
      "order_item_id": 2,
      "item_type": "package",
      "item_name": "Election Starter Pack",
      "fields": [
        {
          "id": 20,
          "field_name": "Candidate Photo",
          "field_type": "image",
          "is_required": true,
          "submitted": false
        }
      ]
    }
  ]
}
```

#### Step 3: Customer Uploads Resources
Customer fills in the fields for each item:
```
POST /api/orders/12345/submit-resources/

{
  "order_item_id": 1,
  "submissions": [
    {
      "field_id": 10,
      "file": <candidate_photo.jpg>
    },
    {
      "field_id": 11,
      "text_value": "Vote for Change!"
    }
  ]
}
```

#### Step 4: System Stores Submissions
Creates DynamicResourceSubmission records:
```
DynamicResourceSubmission
├── order_item: Item 1 (Social Media Campaign)
├── field_definition: Field 10 (Candidate Photo)
└── file_value: /media/user_resources/dynamic/candidate_photo.jpg

DynamicResourceSubmission
├── order_item: Item 1 (Social Media Campaign)
├── field_definition: Field 11 (Campaign Slogan)
└── text_value: "Vote for Change!"
```

### 4. **Admin View (What You See)**

When admin views order details, the system:

1. **Groups resources by order item:**
```
Order #12345 Resources:
├── Social Media Campaign
│   ├── Images:
│   │   └── Candidate Photo (uploaded 2024-01-15)
│   ├── Additional Information:
│   │   ├── Campaign Slogan: "Vote for Change!"
│   │   └── WhatsApp Number: +91-9876543210
│   └── Documents: (none)
│
└── Election Starter Pack
    ├── Images:
    │   ├── Candidate Photo (uploaded 2024-01-15)
    │   └── Party Symbol (uploaded 2024-01-15)
    └── Documents:
        └── Manifesto Document (uploaded 2024-01-15)
```

2. **Displays each resource with:**
   - Field name (from ResourceFieldDefinition)
   - Field type (image, text, document, etc.)
   - Uploaded value
   - Upload timestamp
   - File name (for documents)

### 5. **Key Features**

#### ✅ Dynamic Matching
- Each product has its own unique fields
- Fields are automatically fetched based on the product
- No hardcoded field names

#### ✅ Flexible Field Types
- **Image**: Photos, logos, graphics
- **Document**: PDFs, Word docs, etc.
- **Text**: Slogans, descriptions, notes
- **Phone**: Contact numbers
- **Date**: Preferred dates, deadlines
- **Number**: Quantities, counts

#### ✅ Validation
- Required vs Optional fields
- File size limits
- Allowed file extensions
- Text length limits
- Number ranges

#### ✅ Order & Organization
- Fields display in configured order
- Grouped by field type (Images, Documents, Info)
- Grouped by order item

### 6. **Example Scenarios**

#### Scenario A: Different Campaigns, Different Fields
```
Campaign A: "Social Media Campaign"
└── Fields: Photo, Logo, Slogan, WhatsApp

Campaign B: "Print Media Campaign"
└── Fields: Photo, Tagline, Address, Print Size

Order contains both campaigns:
├── Item 1: Social Media Campaign
│   └── Shows: Photo, Logo, Slogan, WhatsApp fields
└── Item 2: Print Media Campaign
    └── Shows: Photo, Tagline, Address, Print Size fields
```

#### Scenario B: Same Campaign, Multiple Quantities
```
Order:
├── Item 1: Social Media Campaign (Qty: 1)
│   └── Requires: 1 set of resources
└── Item 2: Social Media Campaign (Qty: 1)
    └── Requires: Another set of resources (different candidate)
```

Each order item gets its own resource submission, even if it's the same product.

### 7. **Benefits**

#### For Admins
- ✅ Customize fields per product
- ✅ Add/remove fields anytime
- ✅ Set validation rules
- ✅ Reorder fields easily

#### For Customers
- ✅ Clear instructions (help text)
- ✅ Only see relevant fields
- ✅ Know what's required vs optional
- ✅ Track submission status

#### For System
- ✅ Scalable (add new products easily)
- ✅ Maintainable (no code changes needed)
- ✅ Flexible (any field type)
- ✅ Organized (grouped by item)

## Technical Implementation

### Backend (Django)
```python
# Get resources for an order
for item in order.items.all():
    # Get product-specific fields
    fields = ResourceFieldDefinition.objects.filter(
        content_type=item.content_type,
        object_id=item.object_id
    )
    
    # Get customer submissions
    submissions = DynamicResourceSubmission.objects.filter(
        order_item=item
    )
    
    # Match submissions to fields
    for submission in submissions:
        field = submission.field_definition
        # Display based on field_type
```

### Frontend (React)
```typescript
// Resources are grouped by order item
order.resources.map(resourceGroup => (
  <div key={resourceGroup.order_item_id}>
    <h4>{resourceGroup.item_name}</h4>
    
    {/* Images */}
    {resourceGroup.dynamic
      .filter(f => f.field_type === 'image')
      .map(field => (
        <img src={field.value} alt={field.field_name} />
      ))}
    
    {/* Documents */}
    {resourceGroup.dynamic
      .filter(f => f.field_type === 'document')
      .map(field => (
        <a href={field.value}>{field.field_name}</a>
      ))}
    
    {/* Text fields */}
    {resourceGroup.dynamic
      .filter(f => f.field_type === 'text')
      .map(field => (
        <div>{field.field_name}: {field.value}</div>
      ))}
  </div>
))
```

## Summary

**Yes, resources are fully dynamic and matched to products!**

- Each product (Campaign/Package) defines its own resource fields
- When a customer orders a product, they must fill those specific fields
- The admin panel displays resources grouped by order item
- Each order item shows only the fields defined for that product
- The system is flexible, scalable, and requires no code changes to add new fields

This architecture allows the platform to support any type of campaign or package with any combination of resource requirements!
