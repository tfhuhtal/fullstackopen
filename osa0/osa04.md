sequenceDiagram
User->>Browser:
end
Note right of User: User writes something into the text field and clicks submit button.


Browser->>Server: HTTP POST https://fullstack-exampleapp.herokuapp.com/notes
end
