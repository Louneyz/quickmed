from PIL import Image, ImageChops
import os

def get_projection_ranges(data, axis, threshold=0):
    """
    Finds continuous ranges where data > threshold.
    data: list of values (e.g., pixel counts)
    axis: 'x' or 'y' (just for mental model, logic is 1D)
    Returns list of (start, end) tuples.
    """
    ranges = []
    in_range = False
    start = 0
    
    for i, val in enumerate(data):
        has_content = val > threshold
        if has_content and not in_range:
            in_range = True
            start = i
        elif not has_content and in_range:
            in_range = False
            ranges.append((start, i))
            
    if in_range:
        ranges.append((start, len(data)))
        
    return ranges

def smart_extract(image_path, output_dir):
    try:
        img = Image.open(image_path).convert('RGB')
        width, height = img.size
        
        # 1. Create a binary difference mask against background
        bg_color = img.getpixel((0, 0))
        bg = Image.new('RGB', img.size, bg_color)
        diff = ImageChops.difference(img, bg)
        # Convert to grayscale to sum easier
        diff_gray = diff.convert('L')
        
        # 2. Project to Y-axis to find Rows
        # Row projection: sum of pixel values in each row
        # We can implement this manually or iterate.
        # Let's iterate efficiently.
        
        y_proj = []
        for y in range(height):
            row_sum = 0
            for x in range(width):
                if diff_gray.getpixel((x, y)) > 20: # Noise threshold
                    row_sum += 1
            y_proj.append(row_sum)
            
        # Find row ranges (e.g. Row 1, Row 2)
        row_ranges = get_projection_ranges(y_proj, 'y', threshold=5) # require >5 pixels of content
        
        print(f"Found {len(row_ranges)} rows.")
        
        logos = []
        
        for r_idx, (r_start, r_end) in enumerate(row_ranges):
            # Extract the simplified row strip to process X-projection
            # (We analyze the full width of this Y-range)
            
            x_proj = []
            for x in range(width):
                col_sum = 0
                for y in range(r_start, r_end):
                    if diff_gray.getpixel((x, y)) > 20: 
                        col_sum += 1
                x_proj.append(col_sum)
                
            col_ranges = get_projection_ranges(x_proj, 'x', threshold=2)
            
            print(f"Row {r_idx+1}: Found {len(col_ranges)} logos.")
            
            for c_start, c_end in col_ranges:
                # Add some padding without going out of bounds
                pad = 5
                y1 = max(0, r_start - pad)
                y2 = min(height, r_end + pad)
                x1 = max(0, c_start - pad)
                x2 = min(width, c_end + pad)
                
                logo_crop = img.crop((x1, y1, x2, y2))
                logos.append(logo_crop)

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Save logos with transparency (same logic as before)
        for i, logo in enumerate(logos):
            logo_rgba = logo.convert("RGBA")
            data = logo_rgba.getdata()
            new_data = []
            bg_r, bg_g, bg_b = bg_color
            tolerance = 30
            
            for item in data:
                r, g, b, a = item
                if (r >= bg_r - tolerance and r <= bg_r + tolerance and
                    g >= bg_g - tolerance and g <= bg_g + tolerance and
                    b >= bg_b - tolerance and b <= bg_b + tolerance):
                    new_data.append((255, 255, 255, 0))
                else:
                    new_data.append(item)
            
            logo_rgba.putdata(new_data)
            
            # Final trim just in case
            bbox = logo_rgba.getbbox()
            if bbox:
                logo_rgba = logo_rgba.crop(bbox)
                
            # Overwrite the existing files to fix them
            filename = f"partner_logo_color_{i+1}.png"
            logo_rgba.save(os.path.join(output_dir, filename), "PNG")
            print(f"Saved {filename}")

    except Exception as e:
        print(f"Error: {e}")

image_file = "/Users/georgiozikantas/.gemini/antigravity/brain/d7c33eb9-4b7f-4238-8b73-3754cde2b08a/uploaded_media_0_1770212211586.png"
smart_extract(image_file, "public/images")
