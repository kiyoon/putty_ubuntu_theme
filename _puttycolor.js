// Notice of change by Kiyoon Kim (github.com/kiyoon)
// Original code only changes Colour settings in putty-ubuntu.reg file.
// This modified code changes all settings written in the putty-ubuntu.reg file, so this includes changing of font.
//
// Registry find library 
var Registry = function(iTree, sComputerName) {
  this.iTree = (iTree || Registry.HKEY_LOCAL_MACHINE);
  this.sComputerName = (sComputerName || '.');
  var locStr = 'winmgmts:{impersonationLevel=impersonate}//'
             + this.sComputerName
             + '/root/default:StdRegProv';
  this.oRegistry = GetObject(locStr);
};

// Add some useful constants to the Registry class.
(function() {
  var constants = { 'HKEY_CLASSES_ROOT':   0x80000000
                  , 'HKEY_CURRENT_USER':   0x80000001
                  , 'HKEY_LOCAL_MACHINE':  0x80000002
                  , 'HKEY_USERS':          0x80000003
                  , 'HKEY_CURRENT_CONFIG': 0x80000005
                  , 'HKEY_DYN_DATA':       0x80000006
                  , 'type': { 'REG_SZ':        1
                  ,           'REG_EXPAND_SZ': 2
                  ,           'REG_BINARY':    3
                  ,           'REG_DWORD':     4
                  ,           'REG_MULTI_SZ':  7 }
                  };
  for (var c in constants) { Registry[c] = constants[c]; }
})();

// Create Registry class methods which which wrap WMI calls.
(function () {
  var pro = Registry.prototype;
  var wmiSig = { 'EnumKey':                ['hDefKey', 'sSubKeyName']
               , 'EnumValues':             ['hDefKey', 'sSubKeyName']
               , 'GetBinaryValue':         ['hDefKey', 'sSubKeyName', 'sValueName']
               , 'GetDWORDValue':          ['hDefKey', 'sSubKeyName', 'sValueName']
               , 'GetExpandedStringValue': ['hDefKey', 'sSubKeyName', 'sValueName']
               , 'GetStringValue':         ['hDefKey', 'sSubKeyName', 'sValueName']
               , 'GetMultiStringValue':    ['hDefKey', 'sSubKeyName', 'sValueName']
               };
  for (var methodName in wmiSig) {
    pro[methodName] = (function(name, args) {
      return function(inSpec) {
        var oMeth = this.oRegistry.Methods_(name)
          , oIn = oMeth.inParameters.SpawnInstance_();
        for (var i in args) {
          if (inSpec[args[i]]) {
            oIn[args[i]] = inSpec[args[i]];
          }
        }
        return this.oRegistry.ExecMethod_(name, oIn);
      }
    })(methodName, wmiSig[methodName]);
  }
})();

// Traverses from the given root key (folder) and yields subkeys to the handler.
Registry.prototype.get_keys = function(rootKey, handler) {
    var oOut = this.EnumKey({hDefKey: this.iTree, sSubKeyName:rootKey});
    var aSubKeys = oOut.sNames.toArray();
    for (var i=0; i<aSubKeys.length; i++) {
	  handler(aSubKeys[i])
	}
    return true;
};

// my code
var args = WScript.Arguments;
if (args.length<1) {
	WScript.Echo("Drag'n'Drop .reg file to this script in Windows Explorer");
	WScript.Quit(666);
}
var FilePath = args.item(0);

var result1 = WScript.CreateObject("WScript.Shell").Popup("Apply colors settings from "+FilePath+"?", 0, "Putty Color", 68);
if (result1!=6 ) { WScript.Quit(666); }

fs = new ActiveXObject("Scripting.FileSystemObject");
f = fs.GetFile(FilePath);
is = f.OpenAsTextStream( 1, 0 );
var Colours = [];
keyRegex = /"(.*)"=/

while( !is.AtEndOfStream ){
	var line = is.ReadLine();
	if (keyRegex.exec(line)) {
		var colar = line.split("=");
		if (colar[1].split(":")[0] == "dword") {
			Colours[colar[0].slice(1,-1)] = colar[1];
		} else {
			Colours[colar[0].slice(1,-1)] = colar[1].slice(1,-1);	// slice quotation marks
		}
	}
}
is.Close();

var WSHShell = WScript.CreateObject("WScript.Shell");

var reg = new Registry(Registry.HKEY_CURRENT_USER)
      , rootKey = 'Software\\SimonTatham\\PuTTY\\Sessions'
    reg.get_keys(rootKey, function(path) {
		for (var key in Colours) {
			if (Colours[key].split(":")[0] == "dword") {
				WSHShell.RegWrite("HKEY_CURRENT_USER\\"+rootKey+"\\"+path+"\\"+key,parseInt(Colours[key].split(":")[1], 16),"REG_DWORD");
			} else {
				WSHShell.RegWrite("HKEY_CURRENT_USER\\"+rootKey+"\\"+path+"\\"+key,Colours[key],"REG_SZ");
			}
		}
		return true; 
	});

WScript.Echo("Setings from file "+FilePath+" were applied!");
