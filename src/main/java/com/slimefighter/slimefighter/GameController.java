    package com.slimefighter.slimefighter;

    import javafx.fxml.FXML;
    import javafx.scene.control.Button;
    import javafx.scene.image.ImageView;

    import java.io.IOException;

    public class GameController {
        @FXML
        private ImageView FirstPlayer;
        @FXML
        private ImageView SecondPlayer;
        @FXML
        private Button RandomSlimeButton;
        @FXML
        private Button FightButton;
        @FXML
        private Button LuckButton;
        @FXML
        private ImageView FirstPlayerLife3;
        @FXML
        private ImageView FirstPlayerLife1;
        @FXML
        private ImageView FirstPlayerLife2;
        @FXML
        private ImageView SecondPlayerLife1;
        @FXML
        private ImageView SecondPlayerLife2;
        @FXML
        private ImageView SecondPlayerLife3;


        @FXML
        private Slime[] slimes = {
                new Slime("/images/SlimeRancher/Slimes/Gato_monedas.png", 50, 30, 70),
                new Slime("/images/SlimeRancher/Slimes/Slime_Lava.png", 70, 50, 40),
                new Slime("/images/SlimeRancher/Slimes/Slime_agua.png", 30, 20, 90),
                new Slime("/images/SlimeRancher/Slimes/Slime_dorado.png", 90, 70, 60),
                new Slime("/images/SlimeRancher/Slimes/Slime_espacial.png", 60, 40, 80),
                new Slime("/images/SlimeRancher/Slimes/Slime_Fuego.png", 80, 60, 50),
                new Slime("/images/SlimeRancher/Slimes/Slime_Gato.png", 40, 30, 70),
                new Slime("/images/SlimeRancher/Slimes/Slime_gato_enfadado.png", 70, 60, 40),
                new Slime("/images/SlimeRancher/Slimes/Slime_Lunar.png", 60, 40, 80),
                new Slime("/images/SlimeRancher/Slimes/Slime_miel.png", 50, 40, 50),
                new Slime("/images/SlimeRancher/Slimes/Slime_Normal.png", 30, 30, 60),
                new Slime("/images/SlimeRancher/Slimes/Slime_podrido.png", 20, 80, 20),
                new Slime("/images/SlimeRancher/Slimes/Slime_roca.png", 80, 70, 30),
                new Slime("/images/SlimeRancher/Slimes/Slime_Toxico.png", 60, 50, 60),
                new Slime("/images/SlimeRancher/Slimes/Slime_Zorro.png", 70, 40, 90),
        };


        private enum Atributos {
            ATAQUE,
            DEFENSA,
            VELOCIDAD
        }

        @FXML
        private void initialize(){
            setRandomSlimes();

            FightButton.setOnAction(e -> {
                Fight();
            });

            LuckButton.setOnAction(e -> {
                Luck();
            });
        }

        private void Luck() {
            // Seleccionar slime aleatorio
            int randomSlime = (int) (Math.random() * slimes.length);
            // Seleccionar atributo aleatorio
            int randomAtri = (int) (Math.random() * 3);
            // Seleccionar valores aleatorios
            int randomVal = (int) (Math.random() * 100) + 1;

            // Ajustar atributos
            switch (Atributos.values()[randomAtri]) {
                case ATAQUE:
                    slimes[randomSlime].setAtaque(slimes[randomSlime].getAtaque() + randomVal);
                    break;
                case DEFENSA:
                    slimes[randomSlime].setDefensa(slimes[randomSlime].getDefensa() + randomVal);
                    break;
                case VELOCIDAD:
                    slimes[randomSlime].setVelocidad(slimes[randomSlime].getVelocidad() + randomVal);
                    break;
            }
        }

        private void Fight() {
            // Seleccionar atributo aleatorio
            int randomAtri= (int) (Math.random() * 3);
            // Seleccionar valores aleatorios
            int randomVal = (int) (Math.random() * 100) + 1;
            int randomVal2 = (int) (Math.random() * 100) + 1;

            boolean FirstWinPlayer;

            // Comparar atributos
            switch (Atributos.values()[randomAtri]) {
                case ATAQUE:
                    FirstWinPlayer = (slimes[0].getAtaque() + randomVal) > (slimes[1].getAtaque() + randomVal2);
                    break;
                case DEFENSA:
                    FirstWinPlayer = (slimes[0].getDefensa() + randomVal) > (slimes[1].getDefensa() + randomVal2);
                    break;
                case VELOCIDAD:
                    FirstWinPlayer = (slimes[0].getVelocidad() + randomVal) > (slimes[1].getVelocidad() + randomVal2);
                    break;
                default:
                    return;
            }
            // Manejar  vidas
            LifeVisibility(FirstWinPlayer);
        }

        private void LifeVisibility(boolean FirstWinPlayer) {
            // Restar vida
            if (FirstWinPlayer) {
                RestLife(SecondPlayerLife1, SecondPlayerLife2, SecondPlayerLife3);
            } else {
                RestLife(FirstPlayerLife1, FirstPlayerLife2, FirstPlayerLife3);
            }
        }

        private void RestLife(ImageView Life1, ImageView Life2, ImageView Life3) {
            // Ocultar vida
            if (Life1.isVisible()) {
                Life1.setVisible(false);
            } else if (Life2.isVisible()) {
                Life2.setVisible(false);
            } else if (Life3.isVisible()) {
                Life3.setVisible(false);
            }
        }

        private void setRandomSlimes() {
            // Seleccionar dos slimes aleatorios
            int randomSlime1 = (int) (Math.random() * slimes.length);
            // Los slimes no pueden ser iguales
            int randomSlime2;
            do {
                randomSlime2 = (int) (Math.random() * slimes.length);
            } while (randomSlime1 == randomSlime2);

            // Mostrar slimes
            FirstPlayer.setImage(slimes[randomSlime1].getImage());
            SecondPlayer.setImage(slimes[randomSlime2].getImage());

            // Ajustar tamaño
            FirstPlayer.setFitHeight(200);
            FirstPlayer.setFitWidth(200);
            SecondPlayer.setFitHeight(200);
            SecondPlayer.setFitWidth(200);
        }
    }
