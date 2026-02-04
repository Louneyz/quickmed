from PIL import Image

def remove_background(input_path, output_path, tolerance=30):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    
    # Get the background color from the top-left pixel
    bg_color = datas[0]
    
    newData = []
    for item in datas:
        # Check if the pixel matches the background color within a tolerance
        if all(abs(item[i] - bg_color[i]) < tolerance for i in range(3)):
            newData.append((255, 255, 255, 0)) # Transparent
        else:
            newData.append(item)
    
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

try:
    input_file = "/Users/georgiozikantas/.gemini/antigravity/brain/d7c33eb9-4b7f-4238-8b73-3754cde2b08a/hero_illustration_1770207656274.png"
    output_file = "/Users/georgiozikantas/.gemini/antigravity/scratch/quickmed-clone/public/images/hero_illustration_transparent.png"
    remove_background(input_file, output_file)
except Exception as e:
    print(f"Error: {e}")
