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

import com.google.appengine.api.users.User;
import com.google.sps.data.StudentInfo;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import org.mockito.Mockito;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/** Testing the StudentInfo class. */
@RunWith(JUnit4.class)
public final class StudentInfoTest extends Mockito {
  ///////////
  // Users //
  ///////////
  private static final User USER_ONE = new User("userone@gmail.com","@gmail.com");
  private static final User USER_TWO = new User("usertwo@gmail.com","@gmail.com");
  private static final User USER_THREE = new User("userthree@gmail.com","@gmail.com");

  //////////////////
  // Student Info //
  //////////////////
  private static final StudentInfo NO_NICKNAME = new StudentInfo(USER_ONE,"","/");
  private static final StudentInfo NO_LOGOUT_URL = new StudentInfo(USER_TWO,"hotdog","");
  private static final StudentInfo STUDENT_ONE = new StudentInfo(USER_THREE,"ace","/");

  @Test
  public void noNickname() {
    String nickname = "";
    String logOutUrl = "/";
    StudentInfo STUDENT_A = new StudentInfo(USER_ONE, nickname, logOutUrl);

    boolean actual = (STUDENT_A.getNickname().equals(NO_NICKNAME.getNickname()));;
    boolean expected = true;

    Assert.assertEquals(expected, actual);
  }
}

