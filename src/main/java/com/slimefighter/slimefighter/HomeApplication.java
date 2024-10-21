package com.slimefighter.slimefighter;

import javafx.application.Application;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.stage.Stage;

import java.io.IOException;

public class HomeApplication extends Application {
    @FXML
    private Button PlayButton;

    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(HomeApplication.class.getResource("home-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 800, 600);
        stage.setScene(scene);
        stage.show();
    }

    @FXML
    private void initialize() {
        PlayButton.setOnAction(e -> {
            try {
                VentanaJuego();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        });
    }

    private void VentanaJuego() throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(GameController.class.getResource("game-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        Stage stage = new Stage();
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
