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

package com.google.sps;

import static com.google.appengine.api.datastore.FetchOptions.Builder.withLimit;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.sps.servlets.LoopingData;
import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import org.apache.commons.io.FileUtils;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Mockito.*;
import org.junit.Assert;
import org.junit.Assert.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/** Testing Drop Down Looping Java Servlet. */
@RunWith(JUnit4.class)
public final class LoopingDataTest extends Mockito {
  private final LocalServiceTestHelper helper =
    new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig());

  @Mock
  private LoopingData servlet;
  
  @Mock
  private HttpServletRequest request;
  
  @Mock
  private HttpServletResponse response;

  @Before
  public void setUp() {
    servlet = new LoopingData();
    helper.setUp();
    MockitoAnnotations.initMocks(this);
  }

  @After
  public void tearDown() {
    helper.tearDown();
  }
  
  @Test
  public void isNotLoggedIn() throws IOException {
    UserService userService = UserServiceFactory.getUserService();

    boolean actual = userService.isUserLoggedIn();
    boolean expected = false;

    Assert.assertEquals(expected, actual);
  }
  
  @Test
  public void tenPoints() throws IOException { 
    when(request.getParameter("points")).thenReturn("Ten");

    StringWriter stringWriter = new StringWriter();
    PrintWriter writer = new PrintWriter(stringWriter);
    when(response.getWriter()).thenReturn(writer);

    servlet.doPost(request, response);
    writer.flush();

    String actual = request.getParameter("points");
    String expected = "Ten";

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void twelvePoints() throws IOException { 
    when(request.getParameter("points")).thenReturn("Twelve");

    StringWriter stringWriter = new StringWriter();
    PrintWriter writer = new PrintWriter(stringWriter);
    when(response.getWriter()).thenReturn(writer);

    servlet.doPost(request, response);
    writer.flush();

    String actual = request.getParameter("points");
    String expected = "Twelve";

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void fourteenPoints() throws IOException { 
    when(request.getParameter("points")).thenReturn("Fourteen");

    StringWriter stringWriter = new StringWriter();
    PrintWriter writer = new PrintWriter(stringWriter);
    when(response.getWriter()).thenReturn(writer);

    servlet.doPost(request, response);
    writer.flush();

    String actual = request.getParameter("points");
    String expected = "Fourteen";

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void eighteenPoints() throws IOException { 
    when(request.getParameter("points")).thenReturn("Eighteen");

    StringWriter stringWriter = new StringWriter();
    PrintWriter writer = new PrintWriter(stringWriter);
    when(response.getWriter()).thenReturn(writer);

    servlet.doPost(request, response);
    writer.flush();

    String actual = request.getParameter("points");
    String expected = "Eighteen";

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void falseAnswer() throws IOException {
    when(request.getParameter("points")).thenReturn("Twelve");

    StringWriter stringWriter = new StringWriter();
    PrintWriter writer = new PrintWriter(stringWriter);
    when(response.getWriter()).thenReturn(writer);

    servlet.doPost(request, response);
    writer.flush();

    boolean actual = request.getParameter("points").equals("Eighteen");
    boolean expected = false;

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void addLoopingEntities() throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    int count = 0;
    for(int i=0; i<4; i++) {
      Entity dataEntity = new Entity("LoopingData");
      dataEntity.setProperty("Points", "Ten");
      dataEntity.setProperty("Submissions", 1);
      dataEntity.setProperty("Timestamp", System.currentTimeMillis());
      dataEntity.setProperty("UserID", "185224387890");
      datastore.put(dataEntity);
      count++;
    }
    
    Assert.assertEquals(count, datastore.prepare(new Query("LoopingData")).countEntities(withLimit(10)));
  }

  @Test
  public void postSameUser() throws IOException { 
    Query query = new Query("LoopingData");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    for (int i=0; i<2; i++){
      Entity dataEntity = new Entity("LoopingData");
      if (i == 0) {
        dataEntity.setProperty("Points", "Twelve");
      }
      else {
        dataEntity.setProperty("Points", "Ten");
      }
      dataEntity.setProperty("Submissions", 1);
      dataEntity.setProperty("Timestamp", System.currentTimeMillis());
      dataEntity.setProperty("UserID", "146120385606");
      datastore.put(dataEntity);
    }

    String prevUserId = "";
    String userId = "";
    int count = 0;

    for(Entity entity : results.asIterable()){
      String points = (String) entity.getProperty("Points");
      if (count % 2 != 0) {
        prevUserId = userId;
      }
      userId = (String) entity.getProperty("UserID");
      count++;
    }

    boolean actual = prevUserId.equals(userId);
    boolean expected = true;

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void postNotSameUser() throws IOException { 
    Query query = new Query("LoopingData");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    for (int i=0; i<2; i++){
      Entity dataEntity = new Entity("LoopingData");
      if (i == 0) {
        dataEntity.setProperty("UserID", "146120385606");
      }
      else {
        dataEntity.setProperty("UserID", "127189494719");
      }
      dataEntity.setProperty("Points", "Ten");
      dataEntity.setProperty("Submissions", 1);
      dataEntity.setProperty("Timestamp", System.currentTimeMillis());
      datastore.put(dataEntity);
    }

    String prevUserId = "";
    String userId = "";
    int count = 0;

    for(Entity entity : results.asIterable()){
      String points = (String) entity.getProperty("Points");
      if (count % 2 != 0) {
        prevUserId = userId;
      }
      userId = (String) entity.getProperty("UserID");
      count++;
    }

    boolean actual = prevUserId.equals(userId);
    boolean expected = false;

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void tenSubmissionCount() throws IOException { 
    Query query = new Query("LoopingData");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    for (int i=0; i<50; i++){
      Entity dataEntity = new Entity("LoopingData");
      dataEntity.setProperty("Points", "Ten");
      dataEntity.setProperty("Submissions", 1);
      dataEntity.setProperty("Timestamp", System.currentTimeMillis());
      dataEntity.setProperty("UserID", "146120385606");
      datastore.put(dataEntity);
    }

    int count = 1;
    for(Entity entity : results.asIterable()){
      String points = (String) entity.getProperty("Points");
      String userId = (String) entity.getProperty("UserID");
      if (points.equals("Ten")) {
        count++;
      }
    }

    int actual = count;
    int expected = 51;

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void alternatePointCount() throws IOException { 
    Query query = new Query("LoopingData");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    for (int i=0; i<26; i++){
      Entity dataEntity = new Entity("LoopingData");
      if (i % 2 == 0) {
        dataEntity.setProperty("Points", "Fourteen");
      }
      else {
        dataEntity.setProperty("Points", "Ten");
      }
      dataEntity.setProperty("Submissions", 1);
      dataEntity.setProperty("Timestamp", System.currentTimeMillis());
      dataEntity.setProperty("UserID", "146120385606");
      datastore.put(dataEntity);
    }

    int count = 0;
    for(Entity entity : results.asIterable()){
      String points = (String) entity.getProperty("Points");
      String userId = (String) entity.getProperty("UserID");
      if (points.equals("Fourteen")) {
        count++;
      }
    }

    int actual = count;
    int expected = 13;

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void thousandAlternatePointCount() throws IOException { 
    Query query = new Query("LoopingData");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    for (int i=0; i<1000; i++){
      Entity dataEntity = new Entity("LoopingData");
      if (i % 2 == 0) {
        dataEntity.setProperty("Points", "Fourteen");
      }
      else {
        dataEntity.setProperty("Points", "Ten");
      }
      dataEntity.setProperty("Submissions", 1);
      dataEntity.setProperty("Timestamp", System.currentTimeMillis());
      dataEntity.setProperty("UserID", "146120385606");
      datastore.put(dataEntity);
    }

    int count = 0;
    for(Entity entity : results.asIterable()){
      String points = (String) entity.getProperty("Points");
      String userId = (String) entity.getProperty("UserID");
      if (points.equals("Fourteen")) {
        count++;
      }
    }

    int actual = count;
    int expected = 500;

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void noEntitySubmissions() throws IOException { 
    Query query = new Query("LoopingData");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    int count = 0;
    for(Entity entity : results.asIterable()){
      String points = (String) entity.getProperty("Points");
      String userId = (String) entity.getProperty("UserID");
      if (points.equals("Fourteen")) {
        count++;
      }
    }

    int actual = results.countEntities(withLimit(10));
    int expected = 0;

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void thousandEntitySubmissions() throws IOException { 
    Query query = new Query("LoopingData");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    for (int i=0; i<1000; i++){
      Entity dataEntity = new Entity("LoopingData");
      if (i % 2 == 0) {
        dataEntity.setProperty("Points", "Fourteen");
      }
      else {
        dataEntity.setProperty("Points", "Ten");
      }
      dataEntity.setProperty("Submissions", 1);
      dataEntity.setProperty("Timestamp", System.currentTimeMillis());
      dataEntity.setProperty("UserID", "146120385606");
      datastore.put(dataEntity);
    }
    
    int count = 0;
    for(Entity entity : results.asIterable()){
      String points = (String) entity.getProperty("Points");
      String userId = (String) entity.getProperty("UserID");
      if (points.equals("Fourteen")) {
        count++;
      }
    }

    int actual = results.countEntities(withLimit(1001));
    int expected = 1000;

    Assert.assertEquals(expected, actual);
  }
}

