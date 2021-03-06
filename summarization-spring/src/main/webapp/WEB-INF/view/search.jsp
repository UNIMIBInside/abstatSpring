<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<!DOCTYPE html>
<!--
  This is a starter template page. Use this page to start your new project from
  scratch. This page gets rid of all links and provides the needed markup only.
  -->
<html lang="en" ng-app="schemasummaries">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>ABSTAT</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- OLD -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
    <script src="old/js/controllers.js"></script>
    <script src="old/js/ui-bootstrap-tpls-0.12.1.min.js"></script>
    <link rel="stylesheet" href="css/bootstrap.min.css" type = "text/css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" type = "text/css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="css/ionicons.min.css" type = "text/css">
    <!-- Theme style -->
    <link rel="stylesheet" href="css/AdminLTE.min.css">
    <!-- AdminLTE Skins. We have chosen the skin-blue for this starter
      page. However, you can choose any other skin. Make sure you
      apply the skin class to the body tag so the changes take effect. -->
    <link rel="stylesheet" href="css/skinblue.min.css" type = "text/css">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <!-- Google Font -->
    <link rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
  </head>
  <!--
    BODY TAG OPTIONS:
    =================
    Apply one or more of the following classes to get the
    desired effect
    |---------------------------------------------------------|
    | SKINS         | skin-blue                               |
    |               | skin-black                              |
    |               | skin-purple                             |
    |               | skin-yellow                             |
    |               | skin-red                                |
    |               | skin-green                              |
    |---------------------------------------------------------|
    |LAYOUT OPTIONS | fixed                                   |
    |               | layout-boxed                            |
    |               | layout-top-nav                          |
    |               | sidebar-collapse                        |
    |               | sidebar-mini                            |
    |---------------------------------------------------------|
    -->
  <body class="hold-transition skin-blue fixed sidebar-mini">
    <div class="wrapper">
    <!-- Main Header -->
    <header class="main-header">
      <!-- Logo -->
      <a href="home" class="logo">
        <!-- mini logo for sidebar mini 50x50 pixels -->
        <span class="logo-mini"> <img src="img/bicocca.png" width="50" height="50"> </span>
        <!-- logo for regular state and mobile devices -->
        <span class="logo-lg"><b>ABSTAT</b></span>
      </a>
      <!-- Header Navbar -->
      <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Toggle navigation</span>
        </a>
      </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
      <!-- sidebar: style can be found in sidebar.less -->
      <section class="sidebar">
        <!-- Sidebar Menu -->
        <ul class="sidebar-menu" data-widget="tree">
          <li class="header">ABSTAT</li>
          <!-- Optionally, you can add icons to the links -->
          <li class="active"><a href="home"><i class="fa fa-home"></i> <span>Overview</span></a></li>
          <li class="active"><a href="summarize"><i class="fa fa-gears"></i> <span>Summarize</span></a></li>
          <li class="active"><a href="dataLoading"><i class="fa fa-database"></i> <span>Consolidate</span></a></li>
          <li class="active"><a href="browse"><i class="fa fa-filter"></i> <span>Browse</span></a></li>
          <li class="active"><a href="search"><i class="fa fa-search"></i> <span>Search</span></a></li>
          <li class="active"><a href="management"><i class="fa fa-folder"></i> <span>Manage</span></a></li>
          <li class="active"><a href="apis"><i class="fa fa-link"></i> <span>APIs</span></a></li>
        </ul>
        <!-- /.sidebar-menu -->
      </section>
      <!-- /.sidebar -->
    </aside>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Main content -->
      <section class="content-header">
        <div ng-controller="search" style="overflow: auto;">
          <div class="box box-info">
            <div class="box-body col-md-12">
              <div class="form-group">
                <label>Choose a dataset for filtering</label>
                <select class="form-control select2"  ng-model="selected_dataset">
                  <option ng-option value="all" selected ="selected"> all</option>
                  <c:forEach var="dataset" items="${listDataset}">
                    <option ng-option value="${dataset}">${dataset}</option>
                  </c:forEach>
                </select>
              </div>
              <input type="text" class="form-control" ng-model="srcStr" placeHolder="Search for concepts, properties and abstract knowledge patterns"/>
            </div>
            <div class="box-body col-md-12">
              <div class="checkbox" style="margin-top:-0.2cm">
                <label>
                <input type="checkbox" ng-model="searchInExternalResources">Include non-preferred resources
                </label>
              </div>
              <button type="submit" class="btn btn-primary" ng-click="loadPatterns()">Search</button>
            </div>
            <div  ng-show="allDocuments">
              <div class="box-body">
                <ul class="list-unstyled">
                  <li><span class="fa fa-star-o" aria-hidden="true"></span> <small><strong>prefered</strong> concept / property / akp</small></li>
                </ul>
              </div>
            </div>
            <div  ng-show="allDocuments.length == 0">
              <div class="box-body">
                <h4>Nothing found!</h4>
              </div>
            </div>
            <div >
              <div class="box-body">
                <div ng-repeat="doc in allDocuments">
                  <ul class="list-inline">
                    <li><span class="label label-default">{{doc.dataset}}</span></li>
                    <li><span class="label label-{{doc.type | asLabel}}">{{doc.type}}</span></li>
                    <li><span class="fa fa-{{doc.subtype | asIcon}}" aria-hidden="true"></span></li>
                    <li ng-repeat="uri in doc.URI track by $index">
                      <h4>{{uri | prefixed}}</h4>
                    </li>
                    <li>({{doc.occurrence}})</li>
                  </ul>
                </div>
                <button ng-show="allDocuments" ng-click="loadMore()" type="button" class="btn btn-deafult btn-block">
                <span><strong>{{allDocuments.length}}</strong> results - get more</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->
    <!-- Main Footer -->
    <footer class="main-footer">
      <strong> ABSTAT X.X.X </strong> source code is available on <a href="https://github.com/rAlvaPrincipe/abstatSpring">GitHub</a> under the <a href="https://www.gnu.org/licenses/">GNU Affero General Public License v3.010</a> licence.
    </footer>
    <!-- Control Sidebar -->
    <aside class="control-sidebar control-sidebar-dark">
      <!-- Create the tabs -->
      <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
        <li class="active"><a href="#control-sidebar-home-tab" data-toggle="tab"><i class="fa fa-home"></i></a></li>
        <li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i class="fa fa-gears"></i></a></li>
      </ul>
    </aside>
    <!-- /.control-sidebar -->
    <!-- Add the sidebar's background. This div must be placed
      immediately after the control sidebar -->
    <div class="control-sidebar-bg"></div>
    <!-- ./wrapper -->
    <!-- REQUIRED JS SCRIPTS -->
    <!-- jQuery 3 -->
    <script src="jquery/jquery.min.js"></script>
    <!-- Bootstrap 3.3.7 -->
    <script src="jquery/bootstrap.min.js"></script>
    <!-- AdminLTE App -->
    <script src="jquery/adminlte.min.js"></script>
    <!-- Optionally, you can add Slimscroll and FastClick plugins.
      Both of these plugins are recommended to enhance the
      user experience. -->
  </body>
</html>
