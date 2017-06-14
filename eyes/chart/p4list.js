this.WbstChart = this.WbstChart || {};
(function() {
	var P4List = function() {
		this.init();
	};

	var p = P4List.prototype;

	p.init = function() {
		this.initDom();
	};

	p.initDom = function() {
		this.$tbody1 = $('#tbody1');
		this.$tbody2 = $('#tbody2');
	}

	p.setConfig = function(value) {
		this._config = value;
	};

	p.setDataProvider = function(value) {
		this._dataProvider = value;
		this.creationContent();
	};

	p.creationContent = function() {
		if (this._config == null || this._dataProvider == null) {
			return;
		}

		var htmlStr1 = '';
		var htmlStr2 = '';
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			var item = this._dataProvider[i];
			var name = item.eventName;
			if(name.length>26){
				name = name.substring(0,26)+'...';
			}
			if (i < len/2) {
				htmlStr1 += '<tr>' +
					'<td style="font-family:DIN Medium;">' + (i + 1) + '</td>' +
					'<td>' + name + '</td>' +
					'<td style="font-family:DIN Medium;">' + item.num + '</td>' +
					'<td>' + item.regionName + '</td>' +
					'<td>' + item.level + '</td>' +
					'</tr>';
			} else if (i < 10) {
				htmlStr2 += '<tr>' +
					'<td style="font-family:DIN Medium;">' + (i + 1) + '</td>' +
					'<td>' + name + '</td>' +
					'<td style="font-family:DIN Medium;">' + item.num + '</td>' +
					'<td>' + item.regionName + '</td>' +
					'<td>' + item.level + '</td>' +
					'</tr>';
			}
		}
		if (len<=5) {
			htmlStr1 += htmlStr2;
			htmlStr2 = '';
		}

		this.$tbody1.html(htmlStr1);
		this.$tbody2.html(htmlStr2);

	};

	WbstChart.P4List = P4List;
})();