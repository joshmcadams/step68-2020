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

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.users.User;

public final class Comment {

  private final String id;
  private final String commentText;
  private final long timestamp;

  protected static final String ENTITY_COMMENT = "comment";
  protected static final String ENTITY_TIMESTAMP = "timestamp";
  protected static final String UNKNOWN_USER = "[Unknown]";

  public Comment(String id, String commentText, long timestamp) {
    this.id = id;
    this.commentText = commentText;
    this.timestamp = timestamp;
  }

  public static Comment fromDataStore(User userService, Entity entity) {
    String id = userService != null ? userService.getUserId() : UNKNOWN_USER;
    String comment = entity.hasProperty(ENTITY_COMMENT) ?
        (String) entity.getProperty(ENTITY_COMMENT) : "";
    long timestamp = entity.hasProperty(ENTITY_TIMESTAMP) ?
        (long) entity.getProperty(ENTITY_TIMESTAMP) : 0L;
    return new Comment(id, comment, timestamp);
  }

  public String toString() {
    return String.format(
      "id: %s, timestamp: %d, comment: %s",
      this.id, this.timestamp, this.commentText);
  }

  public boolean equals(Object otherObject) {
    if (this == otherObject) {
      return true;
    }

    if (!(otherObject instanceof Comment)) {
      return false;
    }

    Comment other = (Comment)otherObject;

    return
      this.id == other.id &&
      this.commentText == other.commentText &&
      this.timestamp == other.timestamp;
  }
}
