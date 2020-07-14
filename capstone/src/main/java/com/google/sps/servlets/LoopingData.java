// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/looping")
public class LoopingData extends HttpServlet {
  
  private Map<String, Long> submissions = new HashMap<>();
  private boolean hasSubmitted = false;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();
    String currUserId = "";
    if (!userService.isUserLoggedIn()) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
    else {
      currUserId = userService.getCurrentUser().getUserId();
    }
    
    // Prepare the Query to store the entities you want to load
    Query query = new Query("LoopingData").addSort("Timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    
    Map<String, Long> loopAnswers = new HashMap<>();
    for(Entity entity : results.asIterable()){
      String userId = (String) entity.getProperty("UserID");
      String points = (String) entity.getProperty("Points");
      long newAnswer = (long) entity.getProperty("Submissions");

      if (loopAnswers.containsKey(points)) {
        newAnswer = loopAnswers.get(points);
        newAnswer++;
        if (currUserId.equals(userId) && hasSubmitted == false) {
          loopAnswers.put(points, newAnswer);
          submissions.put(points, newAnswer);
          hasSubmitted = true;
        }
        else {
          loopAnswers.put(points, newAnswer);
          submissions.put(points, newAnswer);
        }
      }
      else {
        newAnswer = 1;
        if (currUserId.equals(userId) && hasSubmitted == false) {
          loopAnswers.put(points, newAnswer);
          submissions.put(points, newAnswer);
          hasSubmitted = true;
        }
        else {
          loopAnswers.put(points, newAnswer);
          submissions.put(points, newAnswer);
        }
      }
    } 
    
    Gson gson = new Gson();
    response.setContentType("application/json");
    response.getWriter().println(gson.toJson(loopAnswers));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();
    String currUserId = "";
    if (!userService.isUserLoggedIn()) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
    else {
      currUserId = userService.getCurrentUser().getUserId();
    }
    // Get the submission details
    String points = request.getParameter("points");
    long currentAnswers = 1;
    if (submissions.containsKey(points)) {
      currentAnswers = submissions.get(points);
      currentAnswers++;
    }
    long timestamp = System.currentTimeMillis();
    
    // Add the entry into the private HashMap
    submissions.put(points, currentAnswers);

    // Create an entity and set its properties
    Entity dataEntity = new Entity("LoopingData");
    dataEntity.setProperty("Points", points);
    dataEntity.setProperty("Submissions", currentAnswers);
    dataEntity.setProperty("Timestamp", timestamp);
    dataEntity.setProperty("UserID", currUserId);

    // Store the entities if it's the user's first submission
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    if (hasSubmitted == false) {
      datastore.put(dataEntity);
      hasSubmitted = true;
    }
    
    // Send the JSON as the response
    response.setContentType("application/json;");
    Gson gson = new Gson();
    response.getWriter().println(gson.toJson(dataEntity));

  }
}
