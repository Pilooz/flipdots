#ifndef ENTIREBOARD
#define ENTIREBOARD

#include <Arduino.h>
#include "FlipBoard.h"

#define DTIME 200 // Temps d'alimentation de la bobine

FlipBoard board1(0x21, 0x20);
/*FlipBoard board2(0x23, 0x22);
  FlipBoard board3(0x25, 0x24);*/

class EntireBoard {
  public:
    void setup() {
      Wire.begin(); // wake up I2C bus
      board1.setup();
      /*board2.setup();
        board3.setup();*/

      for (int i = 2; i <= 13; i++) {
        pinMode(i, OUTPUT);
        digitalWrite(i, LOW);
      }

      //this->clear();

    }

    void releaseCurrent() {
      board1.releaseCurrent();
      //board2.releaseCurrent();
      //board3.releaseCurrent();
    }

    void releaseX() {
      board1.releaseX();
      //board2.releaseX();
      //board3.releaseX();
    }

    void releaseY() {
      board1.releaseY();
      //board2.releaseY();
      //board3.releaseY();
    }

    void clear() {

      /*
        for(int j=0; j<16; j++){
        for(int i=0; i<28; i++){
        this->setPixel(i, j, BLACK);
        }
        }


        delay(100);
        for(int j=0; j<16; j++){
        for(int i=0; i<28; i++){
        this->setPixel(27-i, 15-j, YELLOW);
        }
        }
      */


      for (int i = 0; i < 28; i++) {
        for (int j = 0; j < 16; j++) {
          this->setPixel(i, j, BLACK);
        }
      }


      for (int i = 0; i < 28; i++) {
        for (int j = 0; j < 16; j++) {
          this->setPixel(27 - i, 15 - j, YELLOW);
        }
      }

    }

    void selectPanel(unsigned char x, unsigned char y) {
      if (y >= 0 && y < 16) {
        if (x >= 0 && x < 28) {
          digitalWrite(4, LOW);
          digitalWrite(3, LOW);
          digitalWrite(2, LOW);
          board1.setEnablePin(true);
        }
      }
    }

    void setPixel(unsigned char x, unsigned char y, unsigned char color) {

      if (y >= 0 && y < 16) {

        unsigned char mask;

        unsigned ay = y;

        unsigned char ax = x;

        board1.releaseX();

        if (ay > 7 && ay <= 15) {
          mask = 0x80 >> (y - 8);
          if (color == YELLOW) {
            board1.setLastColor( YELLOW);
            board1.setPixel(ax, 15 - ay, YELLOW);
            board1.setX();
            selectPanel(x, y);
            board1.setX();
            delayMicroseconds(DTIME);
          }
          else if (color == BLACK) {
            board1.setLastColor( BLACK);
            board1.setPixel(ax, 15 - ay, BLACK);
            board1.setX();
            selectPanel(x, y);
            board1.setX();
            delayMicroseconds(DTIME);
          }
        }
        else if (ay <= 7 && ay >= 0) {
          mask = 0x80 >> y;
          if (color == YELLOW) {
            board1.setLastColor( YELLOW);
            board1.setPixel(ax, 15 - ay, YELLOW);
            board1.setX();
            selectPanel(x, y);
            board1.setX();
            delayMicroseconds(DTIME);
          }
          else if (color == BLACK) {
            board1.setLastColor( BLACK);
            board1.setPixel(ax, 15 - ay, BLACK);
            board1.setX();
            selectPanel(x, y);
            board1.setX();
            delayMicroseconds(DTIME);
          }
        }


      }

      digitalWrite(13, LOW);

    }

  private:
};

#endif


























