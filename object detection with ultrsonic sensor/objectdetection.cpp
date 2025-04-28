#define TRIG_PIN 5
#define ECHO_PIN 18

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  // Send ultrasonic pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Measure the echo duration
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);  // 30ms timeout

  // Check if a valid echo is received
  if (duration == 0) {
    Serial.println("No Echo received - Check wiring!");
  } else {
    float distance = duration * 0.034 / 2;  // Calculate distance in cm

    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");

    // Detect car if within 15 cm
    if (distance > 0 && distance < 15) {
      Serial.println("Car detected!");
    }
  }

  delay(500);  // Wait before next measurement
}
