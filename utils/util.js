function parseLocations (locations) {
	var cls = [];    
	for (var i = 0; i< locations.length; i++) {
		var cl={};
		var clocation = locations[i];
		cl = parseALocation(clocation);
		cls.push(cl);
  };
  return cls;
}

function parseALocation (clocation) {
	var cl ={};	
	cl.mapInfo=[];
	cl.mapCoordinate=[];
	cl.statistics =[];

	cl.ipAddress = clocation.$.ipAddress;
	cl.userName = clocation.$.userName;
	cl.ssId = clocation.$.ssId;
	cl.band = clocation.$.band;
	cl.apMacAddress = clocation.$.apMacAddress;
	cl.isGuestUser = clocation.$.isGuestUser;
	cl.dot11Status = clocation.$.dot11Status;
	cl.macAddress = clocation.$.macAddress;
	cl.confidenceFactor = clocation.$.confidenceFactor;

	for (var j=0; j<clocation.MapInfo.length; j++) {
		var mi ={};
		mi.dimension = [];
		cl.mapInfo.push(mi);
		var mInfo = clocation.MapInfo[j];
		mi.mapHierarchyString = mInfo.$.mapHierarchyString;
		mi.floorRefId = mInfo.$.floorRefId;
		for(var k=0; k<mInfo.Dimension.length; k++){
		  var dModel ={};
		  mi.dimension.push(dModel);
		  var dm = mInfo.Dimension[k];
		  dModel.length = dm.$.length;
		  dModel.width = dm.$.width;
		  dModel.height = dm.$.height;
		  dModel.offsetX = dm.$.offsetX;
		  dModel.offsetY = dm.$.offsetY;
		  dModel.unit = dm.unit;
		}
	};

	for (var p=0; p<clocation.MapCoordinate.length; p++) {
		var mcModel = {};
		cl.mapCoordinate.push(mcModel);
		var mc = clocation.MapCoordinate[p];
		mcModel.x = mc.$.x;
		mcModel.y = mc.$.y;
		mcModel.unit = mc.$.unit;
	}

	for (var q=0; q<clocation.Statistics.length; q++) {
		var stModel = {};
		cl.statistics.push(stModel);
		var st = clocation.Statistics[q];
		stModel.currentServerStr =st.$.currentServerTime;
		stModel.firstLocatedStr = st.$.firstLocatedTime;
		stModel.lastLocatedStr = st.$.lastLocatedTime;

		stModel.currentServerTime = new Date(st.$.currentServerTime);
		stModel.firstLocatedTime = new Date(st.$.firstLocatedTime);
		stModel.lastLocatedTime = new Date(st.$.lastLocatedTime);
	}
	return cl;
}

exports.parseLocations = parseLocations
exports.parseALocation = parseALocation