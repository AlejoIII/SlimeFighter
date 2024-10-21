module com.slimefighter.slimefighter {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.slimefighter.slimefighter to javafx.fxml;
    exports com.slimefighter.slimefighter;
}