    package com.slimefighter.slimefighter;

    import javafx.fxml.FXML;
    import javafx.scene.control.Button;
    import javafx.scene.control.Label;
    import javafx.scene.image.ImageView;

    import java.io.IOException;

    public class GameController {
        @FXML
        private ImageView FirstPlayer;
        @FXML
        private ImageView SecondPlayer;
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
        private Label showAttribute;
        @FXML
        private Label showAttribute1;
        @FXML
        private Label boostedAttribute1;
        @FXML
        private Label boostedAttribute2;
        @FXML
        private Label ChoosenAttribute;
        @FXML
        private Button RestartButton;

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
        }

        private void Fight() {
            // Seleccionamos el atributo aleatorio
            int randomAtri = (int) (Math.random() * 3);
            // Mostramos el atributo elegido para la pelea
            ChoosenAttribute.setText("Atributo seleccionado: " + Atributos.values()[randomAtri].toString());
            // Seleccionamos los valores aleatorios entre 1 y 100 para cada slime
            int randomVal1 = (int) (Math.random() * 100) + 1;
            int randomVal2 = (int) (Math.random() * 100) + 1;

            boolean FirstWinPlayer;
            // Mostramos la suma del atributo elegido mas el valor aleatorio para cada slime
            switch (Atributos.values()[randomAtri]) {
                case ATAQUE:
                    boostedAttribute1.setText("Ataque: " + slimes[0].getAtaque() + " + " + randomVal1);
                    boostedAttribute2.setText("Ataque: " + slimes[1].getAtaque() + " + " + randomVal2);
                    FirstWinPlayer = (slimes[0].getAtaque() + randomVal1) > (slimes[1].getAtaque() + randomVal2);
                    break;
                case DEFENSA:
                    boostedAttribute1.setText("Defensa: " + slimes[0].getDefensa() + " + " + randomVal1);
                    boostedAttribute2.setText("Defensa: " + slimes[1].getDefensa() + " + " + randomVal2);
                    FirstWinPlayer = (slimes[0].getDefensa() + randomVal1) > (slimes[1].getDefensa() + randomVal2);
                    break;
                case VELOCIDAD:
                    boostedAttribute1.setText("Velocidad: " + slimes[0].getVelocidad() + " + " + randomVal1);
                    boostedAttribute2.setText("Velocidad: " + slimes[1].getVelocidad() + " + " + randomVal2);
                    FirstWinPlayer = (slimes[0].getVelocidad() + randomVal1) > (slimes[1].getVelocidad() + randomVal2);
                    break;
                default:
                    return;
            }
            // Manejamos la visibilidad de las vidas segun el resultado de la pelea
            LifeVisibility(FirstWinPlayer);
        }

        private void LifeVisibility(boolean FirstWinPlayer) {
            // Restamos las vidas
            if (FirstWinPlayer) {
                RestLife(SecondPlayerLife1, SecondPlayerLife2, SecondPlayerLife3);
            } else {
                RestLife(FirstPlayerLife1, FirstPlayerLife2, FirstPlayerLife3);
            }

            if (Endgame()) {
                return;
            }
        }

        private void RestLife(ImageView Life1, ImageView Life2, ImageView Life3) {
            // Ocultamos la vida
            if (Life1.isVisible()) {
                Life1.setVisible(false);
            } else if (Life2.isVisible()) {
                Life2.setVisible(false);
            } else if (Life3.isVisible()) {
                Life3.setVisible(false);
            }
        }

        private boolean Endgame() {
            if (!FirstPlayerLife1.isVisible() && !FirstPlayerLife2.isVisible() && !FirstPlayerLife3.isVisible()) {
                EndgameMessage("¡El slime 1 ha ganado!");
                return true;
            } else if (!SecondPlayerLife1.isVisible() && !SecondPlayerLife2.isVisible() && !SecondPlayerLife3.isVisible()) {
                EndgameMessage("¡El slime 2 ha ganado!");
                return true;
            }
            return false;
        }

        private void EndgameMessage(String message) {
            // Mostramos el mensaje de victoria
            ChoosenAttribute.setText(message);
            // Desactivamos los botones
            FightButton.setDisable(true);
            LuckButton.setDisable(true);
        }

        @FXML
        private void RestartGame() {
            // Volvemos a mostrar las vidas
            FirstPlayerLife1.setVisible(true);
            FirstPlayerLife2.setVisible(true);
            FirstPlayerLife3.setVisible(true);
            SecondPlayerLife1.setVisible(true);
            SecondPlayerLife2.setVisible(true);
            SecondPlayerLife3.setVisible(true);
            // Activamos botones
            FightButton.setDisable(false);
            LuckButton.setDisable(false);
            // Restablecemos los mensajes
            ChoosenAttribute.setText("");
            // Volvemos a elegir slimes aleatorios
            setRandomSlimes();
        }

        private void setRandomSlimes() {
            // Seleccionamos dos slimes aleatorios
            int randomSlime1 = (int) (Math.random() * slimes.length + Atributos.values().length);
            // Los slimes no pueden ser iguales
            int randomSlime2;
            do {
                randomSlime2 = (int) (Math.random() * slimes.length+ Atributos.values().length);
            } while (randomSlime1 == randomSlime2);
            // Mostramos los atributos
            showAttribute(slimes[randomSlime1]);
            showAttribute1(slimes[randomSlime2]);
            // Mostramos los  slimes
            FirstPlayer.setImage(slimes[randomSlime1].getImage());
            SecondPlayer.setImage(slimes[randomSlime2].getImage());
            // Ajustamos el tamaño
            FirstPlayer.setFitHeight(200);
            FirstPlayer.setFitWidth(200);
            SecondPlayer.setFitHeight(200);
            SecondPlayer.setFitWidth(200);
        }
        //añadimos los atributos de los slimes escogidos
        private void showAttribute(Slime slime){
            showAttribute.setText("Ataque: " + slime.getAtaque() + "\n" + "Defensa: " + slime.getDefensa() + "\n" + "Velocidad: " + slime.getVelocidad());
        }
        private void showAttribute1(Slime slime) {
            showAttribute1.setText("Ataque: " + slime.getAtaque() + "\n" + "Defensa: " + slime.getDefensa() + "\n" + "Velocidad: " + slime.getVelocidad());
        }
    }
