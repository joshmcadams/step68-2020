package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import com.google.sps.data.StudentInfo;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/comments")
public class CommentServlet extends HttpServlet {
  UserService userService = UserServiceFactory.getUserService();

  private class jsonComment{
    public String commentInput;

    public jsonComment(String comment){
      this.commentInput = comment;
    }
  }
  
 
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Comments").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    List<Comment> formComments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      String id = userService.getCurrentUser().getUserId();
      String commentText = (String) entity.getProperty("comment");
      long timestamp = (long) entity.getProperty("timestamp");
      Comment comment = new Comment(id, commentText, timestamp);
      formComments.add(comment);
    }
    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(formComments));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
      
    // Get the body of the HTTP Post
    String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

    Gson gson = new Gson();
    jsonComment target = gson.fromJson(body, jsonComment.class);
    
    String userComment = target.commentInput;
    Entity commentEntity = new Entity("Comments");
    long timestamp = System.currentTimeMillis();
    String id = userService.getCurrentUser().getUserId();
    commentEntity.setProperty("comment", userComment);
    commentEntity.setProperty("timestamp", timestamp);
    commentEntity.setProperty("userId", id);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(commentEntity));
      // Redirect back to the HTML page.
    response.sendRedirect("/index.html");
  }
} 