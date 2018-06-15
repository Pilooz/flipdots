#ifndef FLIPBOARD
#define FLIPBOARD

#define BLACK 0
#define YELLOW 1

class FlipBoard {
public:
  FlipBoard(unsigned char addrX, unsigned char addrY) {
    // Setup the flip board with MCP addresses
    this->addrX = addrX;
    this->addrY = addrY;
  }

  void setup() {
    // set all I/O to O

    Wire.beginTransmission(addrX);
    Wire.write(0x00); // IODIRA register
    Wire.write(0x00); // set all of port A to outputs
    Wire.endTransmission();

    Wire.beginTransmission(addrX);
    Wire.write(0x01); // IODIRB register
    Wire.write(0x00); // set all of port B to outputs
    Wire.endTransmission();

    Wire.beginTransmission(addrY);
    Wire.write(0x00); // IODIRA register
    Wire.write(0x00); // set all of port A to outputs
    Wire.endTransmission();

    Wire.beginTransmission(addrY);
    Wire.write(0x01); // IODIRB register
    Wire.write(0x00); // set all of port B to outputs
    Wire.endTransmission();
  }

  void releaseCurrent() {
    digitalWrite(4, LOW);
    digitalWrite(3, LOW);
    digitalWrite(2, LOW);
    digitalWrite(5, LOW);
    digitalWrite(6, LOW);
    digitalWrite(7, LOW);
    digitalWrite(8, LOW);
    digitalWrite(9, LOW);
    digitalWrite(10, LOW);
    releaseX();
    releaseY();

  }

  void releaseX(){
    Wire.beginTransmission(this->addrX);
    Wire.write(0x12); // address port A
    Wire.write( 0b00111111); // value to send
    Wire.endTransmission();
    enablePin = 0;
  }

  void releaseY(){

    Wire.beginTransmission(this->addrY);
    Wire.write(0x12); // address port A
    if(lastColor == YELLOW){
      Wire.write( 0xFF );
    } 
    else if(lastColor == BLACK){

      Wire.write( 0x00 ); // value to send
    }
    Wire.endTransmission();

    Wire.beginTransmission(this->addrY);
    Wire.write(0x13); // address port B
    if(lastColor == YELLOW){
      Wire.write( 0xFF );
    } 
    else if(lastColor == BLACK){

      Wire.write( 0x00 ); // value to send
    }
    Wire.endTransmission();
  }

  void setEnablePin(bool aBool) {
    if (aBool) {
      enablePin = 0b01000000;
    } 
    else {
      enablePin = 0;
    }
  }

  void setLastColor(unsigned char aLastColor){
    lastColor = aLastColor;
  }

  void setPixel(unsigned char x, unsigned char y, unsigned char color) {
    // y == Masses
    unsigned char PORTA_Y;
    unsigned char PORTB_Y;
    unsigned char PORTA_X;

    switch (y) {
    case 0: // Mass 1 - GPB0
      PORTA_Y = 0b00000000;
      PORTB_Y = 0b00000001;
      break;
    case 1: // Mass 2 - GPB1
      PORTA_Y = 0b00000000;
      PORTB_Y = 0b00000010;
      break;
    case 2: // Mass 3 -  GPB3
      PORTA_Y = 0b00000000;
      PORTB_Y = 0b00001000;
      break;
    case 3: // Mass 4 - GPB2
      PORTA_Y = 0b00000000;
      PORTB_Y = 0b00000100;
      break;
    case 4: // Mass 5 - GPB4
      PORTA_Y = 0b00000000;
      PORTB_Y = 0b00010000;
      break;
    case 5: // Mass 6 - GPB5
      PORTA_Y = 0b00000000;
      PORTB_Y = 0b00100000;
      break;
    case 6: // Mass 7 - GPB7
      PORTA_Y = 0b00000000;
      PORTB_Y = 0b10000000;
      break;
    case 7: // Mass 8 - GPB6
      PORTA_Y = 0b00000000;
      PORTB_Y = 0b01000000;
      break;
    case 8: // Mass 9 - GPA7
      PORTA_Y = 0b10000000;
      PORTB_Y = 0b00000000;
      break;
    case 9: // Mass 10 - GPA6
      PORTA_Y = 0b01000000;
      PORTB_Y = 0b00000000;
      break;
    case 10: // Mass 11 - GPA4
      PORTA_Y = 0b00010000;
      PORTB_Y = 0b00000000;
      break;
    case 11: // Mass 12 - GPA5
      PORTA_Y = 0b00100000;
      PORTB_Y = 0b00000000;
      break;
    case 12: // Mass 13 - GPA3
      PORTA_Y = 0b00001000;
      PORTB_Y = 0b00000000;
      break;
    case 13: // Mass 14 - GPA2
      PORTA_Y = 0b00000100;
      PORTB_Y = 0b00000000;
      break;
    case 14: // Mass 15 - GPA0
      PORTA_Y = 0b00000001;
      PORTB_Y = 0b00000000;
      break;
    case 15: // Mass 16 - GPA1
      PORTA_Y = 0b00000010;
      PORTB_Y = 0b00000000;
      break;
    }

    // invert value in case of yellow
    if (color == YELLOW) {
      PORTA_Y = ~PORTA_Y;
      PORTB_Y = ~PORTB_Y;
    }

    if (color == BLACK) {
      if (x < 8) {
        PORTA_X = 0b00000000 + (x);
        lastAddr = PORTA_X;
      } 
      else if (x < 16 && x > 7) {
        PORTA_X = 0b00010000 + (x - 8);
        lastAddr = PORTA_X;
      } 
      else if (x < 24 && x > 15) {
        PORTA_X = 0b00001000 + (x - 16);
        lastAddr = PORTA_X;
      } 
      else if (x < 32 && x > 23) {
        PORTA_X = 0b00011000 + (x - 24);
        lastAddr = PORTA_X;
      }
    }
    if (color == YELLOW) {
      if (x < 8) {
        PORTA_X = 0b00100000 + (x);
        lastAddr = PORTA_X;
      } 
      else if (x < 16 && x > 7) {
        PORTA_X = 0b00110000 + (x - 8);
        lastAddr = PORTA_X;
      } 
      else if (x < 24 && x > 15) {
        PORTA_X = 0b00101000 + (x - 16);
        lastAddr = PORTA_X;
      } 
      else if (x < 32 && x > 23) {
        PORTA_X = 0b00111000 + (x - 24);
        lastAddr = PORTA_X;
      }
    }

    // send Y value
    Wire.beginTransmission(this->addrY);
    Wire.write(0x12); // address port A
    Wire.write( PORTA_Y ); // value to send
    Wire.endTransmission();

    Wire.beginTransmission(this->addrY);
    Wire.write(0x13); // address port B
    Wire.write( PORTB_Y ); // value to send
    Wire.endTransmission();
  }
  
  void setX(){
    // send X value
    
    if (enablePin != 0) {
      lastAddr += enablePin;
    }
    
    Wire.beginTransmission(this->addrX);
    Wire.write(0x12); // address port A
    Wire.write( lastAddr ); // value to send
    Wire.endTransmission();
  }



private:
  unsigned char addrX;
  unsigned char addrY;
  unsigned char enablePin = 0;
  unsigned char lastColor = BLACK;
  unsigned char lastAddr = 0x00;
};

#endif



