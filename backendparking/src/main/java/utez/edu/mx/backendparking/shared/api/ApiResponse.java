package utez.edu.mx.backendparking.shared.api;

import org.springframework.http.HttpStatus;

public class ApiResponse<T> {
    private boolean success;
    private HttpStatus status;
    private int statusCode;
    private String message;
    private T data;

    //Constructor
    public ApiResponse(boolean success, HttpStatus status, String message, T data) {
        this.success = success;
        this.status = status;
        this.statusCode = status.value();//no se manda el numero, automaticamente se obtiene del HttpStatus que numero es
        this.message = message;
        this.data = data;
    }

    //En caso de exito utilizar success
    public static <T> ApiResponse<T> success(HttpStatus status, String message, T data) {
        return new ApiResponse<>(true,status,message,data);
    }

    //para casos donde hubo un error
    public static <T> ApiResponse<T> error(HttpStatus status, String message,T data) {//nota: a veces solo se puede ocupar un mensaje generico (message) y no enviar mas detalles (osea mandar data como null)
        return new ApiResponse<>(false,status,message,data);
    }

    //Getters and setters

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
