package utez.edu.mx.backendparking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendparkingApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendparkingApplication.class, args);
	}

}
