package com.slimefighter.slimefighter;

import javafx.scene.image.Image;

import java.io.InputStream;

public class Slime {
    private String imagePath;
    private int ataque;
    private int defensa;
    private int velocidad;

    public Slime(String imagePath, int ataque, int defensa, int velocidad) {
        this.imagePath = imagePath;
        this.ataque = ataque;
        this.defensa = defensa;
        this.velocidad = velocidad;
    }

    public String getImagePath() {
        return imagePath;
    }

    public int getAtaque() {
        return ataque;
    }

    public int getDefensa() {
        return defensa;
    }

    public int getVelocidad() {
        return velocidad;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public void setAtaque(int ataque) {
        this.ataque = ataque;
    }

    public void setDefensa(int defensa) {
        this.defensa = defensa;
    }

    public void setVelocidad(int velocidad) {
        this.velocidad = velocidad;
    }

    public Image getImage() {
        InputStream imageStream = getClass().getResourceAsStream(imagePath);
        if (imageStream == null) {
            throw new IllegalArgumentException("No se pudo encontrar la imagen en la ruta: " + imagePath);
        }
        return new Image(imageStream);
    }


}
