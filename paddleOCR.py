from paddleocr import PaddleOCR

ocr = PaddleOCR(use_angle_cls=True, lang='en')

image_path = "/images/number_plate.jpg"

result = ocr.ocr(image_path, cls=True)

for line in result:
    for word_info in line:
        text = word_info[1][0]
        print(text)