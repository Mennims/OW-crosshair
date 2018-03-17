
  
  //@TODO: Allow user to save personal crosshair?
  console.log("App started");
  var plugin = new OverwolfPlugin("simple-io-plugin", true);
  var appPath = "";
  var selected = false;
  var mainMenuWindow;
  var mainmainMenuWindowID;
  var crosshairWindow;
  var crosshairWindowID;
  var url = "";

  $(document).ready(function(){
    init();
  });

  // Listeners
  $("#drop").change(function(){setXPreview(document.getElementById("drop").value);});
  $("#hide").mousedown (function(){
    setX(); 
    document.getElementById("MainMenuContainer").style.backgroundColor = 'transparent'; 
    document.getElementById("MainMenuContainer").style.borderImageWidth = "0px";
    document.getElementById("form").style.left = "25px";
    document.getElementById("form").style.top = "52px";
    document.getElementById("leftAdjust").style.display = "none";
    document.getElementById("rightAdjust").style.display = "none";
    document.getElementById("downAdjust").style.display = "none";
    document.getElementById("upAdjust").style.display = "none";
    document.getElementById("recenter").style.display = "none";
    document.getElementById("adjustLabel").style.display = "none";
    selected = true;
  });
  $("#leftAdjust").click(function(){
    overwolf.windows.changePosition(mainMenuWindowID, mainMenuWindow.window.left-1, mainMenuWindow.window.top);
  });
  $("#rightAdjust").click(function(){
    overwolf.windows.changePosition(mainMenuWindowID, results.window.left+1, results.window.top);
  });
  $("#downAdjust").click(function(){
    overwolf.windows.changePosition(mainMenuWindowID, results.window.left, results.window.top+1);
  });
  $("#upAdjust").click(function(){
    overwolf.windows.changePosition(mainMenuWindowID, results.window.left, results.window.top-1);
  });
  $("#MainMenuContainer").mousedown(function(e){
    if (!$(e.target).hasClass('noDrag') && !selected) 
      dragMove();
  });
  $("#recenter").click(function(){
    overwolf.games.getRunningGameInfo(function(result){
      if(!result === null) {
        overwolf.windows.changePosition(mainMenuWindowID, (result.logicalWidth/2)-101, (result.logicalHeight/2)-133);
      }
    });
  });

  // Initialize App stuffs.
  function init(){
    setXPreview(document.getElementById("drop").value);
    
    // Set mainMenuWindowID and mainMenuWindow
    overwolf.windows.obtainDeclaredWindow("MainMenu",
      function(result) {
        if (result.status == "success") {
          mainMenuWindowID = result.window.id;
          mainMenuWindow = result;
        }
      }
    );

    overwolf.windows.obtainDeclaredWindow("Crosshair",
      function(result) {
        if (result.status == "success") {
          crosshairWindowID = result.window.id;
          crosshairWindow = result;
          overwolf.windows.restore(result.window.id,
                function(result){}
          );
        }
      }
    );

    // Show window
    $("#MainMenuContainer").fadeIn();
    $("#CrosshairContainers").fadeIn();

    // Register Hotkeys
    overwolf.settings.registerHotKey("showHide", function(arg) {
      if (arg.status == "success") {
        overwolf.windows.getCurrentWindow(function(window) {
          if (window.window.isVisible === true) {
            minimizeWindow();
          } else {
            restoreWindow();
          }
        });
      }
    });
    
    overwolf.settings.registerHotKey("close", function(arg) {
      if (arg.status == "success") {
        closeWindow();
      }
    });

    plugin.initialize(function(status) {
		  if (status == true) {
        getMyWebAppDirectory(getDirectory);
      } else {
        console.log("Plugin couldn't be loaded?");
		  }
		});
  }

  
  
  
  
  
  
  
  
  
  /////////// HELPER FUNCTIONS //////////

  // Overwolf Window Helper functions
  function dragMove() {
    overwolf.windows.dragMove(mainMenuWindowID);
  };
  function closeWindow() {
    overwolf.windows.close(mainMenuWindowID);
  };
  function minimizeWindow() {
    overwolf.windows.minimize(mainMenuWindowID);
  };
  function restoreWindow() {
    overwolf.windows.restore(mainMenuWindowID);
  };
  function dragResize(edge) {
    overwolf.windows.dragResize(mainMenuWindowID, edge);
  };

  // IO Plugin helpers
  function getDirectory(mypath, status=0){
    appPath = mypath;
  };
  function getMyWebAppDirectory(callback) {
    var mypath = plugin.get().LOCALAPPDATA + "\\Overwolf\\Extensions";
    var fallback = function() {
      var pluginStr = window.location.host;
      pluginStr = pluginStr.replace("Window_Extension_", "");
      var index = pluginStr.lastIndexOf("_");
      if (index != -1) {
        pluginStr = pluginStr.slice(0,index);
      }
      mypath += "\\" + pluginStr + "\\" + "1.0.0";
    }
    overwolf.extensions.current.getManifest(function(manifestObj) {
      if (typeof manifestObj === "undefined") {
        console.error("Could not get Manifest.");
        fallback();
      } else if (typeof manifestObj.UID === "undefined") {
        console.error("Manifest has no UID.");
        fallback();
      } else if (typeof manifestObj.meta === "undefined") {
        console.error("Manifest has no meta object.");
        fallback();
      } else {
        mypath += "\\" + manifestObj.UID + "\\" + manifestObj.meta.version;
      }
      plugin.get().isDirectory( 
        mypath, 
        function(status) {
          callback(mypath, status);
        }
      );
    });
  };

  // Set preview crosshair to new image.
  function setXPreview(value, name){
    switch(value){
      case "default1":
        url = "<img src='../images/default1.png' id='reticle'>";
        break;
      case "default2":
        url = "<img src='../images/default2.png' id='reticle'>";
        break;
      case "default3":
        url = "<img src='../images/default3.png' id='reticle'>";
        break;
      case "default4":
        url = "<img src='../images/default4.png' id='reticle'>";
        break;
      case "default5":
        url = "<img src='../images/default5.png' id='reticle'>";
        break;
      case "default6":
        url = "<img src='../images/default6.png' id='reticle'>";
        break;
      case "default7":
        url = "<img src='../images/default7.png' id='reticle'>";
        break;
      case "default8":
        url = "<img src='../images/default8.png' id='reticle'>";
        break;
      case "default9":
        url = "<img src='../images/default9.png' id='reticle'>";
        break;
      case "custom":
        url = "<img src='../images/customX3.png' id='reticle'>";
        
        overwolf.utils.openFilePicker('*.png*', function(result){
          if(result.status === "success"){
            url = "<img src='" + result.url + "' id='reticle'>";
            document.getElementById("preview").innerHTML = url;
          }
        })
        break;        
    } 
    //document.getElementById("preview").innerHTML = url;
  };

  // Set crosshair and remove options.
  function setX(){
    document.getElementById("form").innerHTML = url;
    $( "#preview" ).remove();
  };
