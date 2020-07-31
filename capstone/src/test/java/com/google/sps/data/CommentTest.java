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

package com.google.sps.data;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.sps.data.Comment;
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

/** Testing Comment. */
@RunWith(JUnit4.class)
public final class CommentTest extends Mockito {
  private final LocalServiceTestHelper helper =
      new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig());

  private final static String EMAIL = "me@example.com";
  private final static String AUTH_DOMAIN = "example.com";
  private final static String ID = "12345";
  private final static User USER = new User(EMAIL, AUTH_DOMAIN, ID);

  private final static String ENTITY_TYPE = "comment";
  private final static String COMMENT_VALUE = "blah, blah, blah";
  private final static long COMMENT_TIMESTAMP = 9876543L;

  @Before
  public void setUp() {
    helper.setUp();
  }

  @After
  public void tearDown() {
    helper.tearDown();
  }

  @Test
  public void fromDataStore() {
    Entity commentEntity = new Entity(ENTITY_TYPE);
    commentEntity.setProperty(Comment.ENTITY_COMMENT, COMMENT_VALUE);
    commentEntity.setProperty(Comment.ENTITY_TIMESTAMP, COMMENT_TIMESTAMP);

    Comment expected = new Comment(ID, COMMENT_VALUE, COMMENT_TIMESTAMP);
    Comment actual = Comment.fromDataStore(USER, commentEntity);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void fromDataStoreNoTimestamp() {
    Entity commentEntity = new Entity(ENTITY_TYPE);
    commentEntity.setProperty(Comment.ENTITY_COMMENT, COMMENT_VALUE);

    Comment expected = new Comment(ID, COMMENT_VALUE, 0L);
    Comment actual = Comment.fromDataStore(USER, commentEntity);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void fromDataStoreNoComment() {
    Entity commentEntity = new Entity(ENTITY_TYPE);
    commentEntity.setProperty(Comment.ENTITY_TIMESTAMP, COMMENT_TIMESTAMP);

    Comment expected = new Comment(ID, "", COMMENT_TIMESTAMP);
    Comment actual = Comment.fromDataStore(USER, commentEntity);

    Assert.assertEquals(expected, actual);
  }

  @Test
  public void fromDataStoreNullUser() {
    Entity commentEntity = new Entity(ENTITY_TYPE);
    commentEntity.setProperty(Comment.ENTITY_COMMENT, COMMENT_VALUE);
    commentEntity.setProperty(Comment.ENTITY_TIMESTAMP, COMMENT_TIMESTAMP);

    Comment expected = new Comment(
        Comment.UNKNOWN_USER, COMMENT_VALUE, COMMENT_TIMESTAMP);
    Comment actual = Comment.fromDataStore(null, commentEntity);

    Assert.assertEquals(expected, actual);
  }
}

