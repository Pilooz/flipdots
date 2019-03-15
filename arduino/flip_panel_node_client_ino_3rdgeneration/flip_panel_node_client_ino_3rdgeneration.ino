#include <Wire.h>
#include "EntireFlipBoard.h"

EntireBoard myBoard;

unsigned char buf[20];

void setup() {
  Serial.begin(115200);
  myBoard.setup();
  myBoard.clear();
  buf[0]=0;
  myBoard.releaseCurrent();
  myBoard.releaseX();
}



int i= 0;

void loop(){
  //myBoard.clear();
  //delay(500);
  

  /*
   *  Code pour Node JS communication par Serial
   */
   if (Serial.available() && i<20) {
    // get the new byte:
    char inChar = (char)Serial.read();
    buf[i] = inChar;
    if(buf[i] != 0xFE){
      i++;
    }
  }


  if(i < 20){
    if(buf[0] == 0xBD && buf[1] == 0xFF && buf[2] == 0x00 && buf[i] == 0xFE){
      // this is a clear screen command
      if(buf[3] == 0xF0){
        myBoard.clear();
        for(int j = 0; j<=i; j++){
          digitalWrite(13, HIGH);
          delay(300);
          digitalWrite(13, LOW);
          delay(300);
        }
      }

      // this is a set pixel command 
      if(buf[3] == 0x10){
        digitalWrite(13, LOW);
        // X Y Color are valid
        unsigned char x = buf[4];
        unsigned char y = buf[5];
        unsigned char color = buf[6];

        myBoard.setPixel(x, y, color);
      }
      buf[0] = 0;
      i=0;
    }
  } else {i=0;}

  myBoard.releaseCurrent();
}
