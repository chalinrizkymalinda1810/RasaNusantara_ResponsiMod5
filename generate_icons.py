import zlib
import struct
import math

def create_png(width, height, filename):
    # RGBA image buffer
    raw_data = bytearray()
    
    cx, cy = width / 2.0, height / 2.0
    radius = min(width, height) * 0.44
    corner_r = min(width, height) * 0.22

    for y in range(height):
        # PNG filter byte 0 (None)
        raw_data.append(0)
        for x in range(width):
            # Squircle / rounded rect distance
            dx = max(abs(x - cx) - (cx - corner_r), 0)
            dy = max(abs(y - cy) - (cy - corner_r), 0)
            dist = math.sqrt(dx * dx + dy * dy)

            if dist > corner_r:
                # Outside rounded rect
                raw_data.extend([0, 0, 0, 0])
            else:
                # Inside icon: gradient from orange (#ea580c: 234, 88, 12) to dark amber (#7c2d12: 124, 45, 18)
                factor = (x + y) / (width + height)
                r = int(234 * (1 - factor) + 124 * factor)
                g = int(88 * (1 - factor) + 45 * factor)
                b = int(12 * (1 - factor) + 18 * factor)
                
                # Draw a bowl shape in white and gold
                # Bowl center
                bcx, bcy = cx, cy + height * 0.08
                bdx = (x - bcx) / (width * 0.3)
                bdy = (y - bcy) / (height * 0.2)
                
                # Check bowl inside
                if y >= bcy - height * 0.05 and (bdx*bdx + (bdy-0.2)*(bdy-0.2) <= 1.0) and y <= bcy + height * 0.22:
                    # White bowl body
                    raw_data.extend([255, 255, 255, 255])
                elif y >= bcy - height * 0.08 and y < bcy and abs(bdx) < 0.9:
                    # Soup broth (golden orange)
                    raw_data.extend([245, 158, 11, 255])
                # Steam waves above
                elif y < bcy - height * 0.12 and y > bcy - height * 0.35 and (abs(x - cx) < width * 0.04 or abs(x - cx - width*0.12) < width * 0.03 or abs(x - cx + width*0.12) < width * 0.03):
                    raw_data.extend([254, 240, 138, 230])
                else:
                    raw_data.extend([r, g, b, 255])

    # Compress raw data
    compressed = zlib.compress(bytes(raw_data), 9)

    # Build PNG chunks
    def chunk(tag, data):
        length = struct.pack('>I', len(data))
        crc = struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
        return length + tag + data + crc

    png = b'\x89PNG\r\n\x1a\n'
    # IHDR chunk: width, height, bit_depth=8, color_type=6 (RGBA), compression=0, filter=0, interlace=0
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png += chunk(b'IHDR', ihdr_data)
    png += chunk(b'IDAT', compressed)
    png += chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Generated {filename}")

if __name__ == '__main__':
    create_png(192, 192, r'C:\Users\asus vivobook\.gemini\antigravity\scratch\rasa-nusantara-pwa\public\icons\icon-192.png')
    create_png(512, 512, r'C:\Users\asus vivobook\.gemini\antigravity\scratch\rasa-nusantara-pwa\public\icons\icon-512.png')
    create_png(180, 180, r'C:\Users\asus vivobook\.gemini\antigravity\scratch\rasa-nusantara-pwa\public\apple-touch-icon.png')
    create_png(192, 192, r'C:\Users\asus vivobook\.gemini\antigravity\scratch\rasa-nusantara-pwa\public\logo.png')
