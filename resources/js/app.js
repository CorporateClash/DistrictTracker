var API = 'https://corporateclash.net/api/v1/districts/';

function queryDistrictAPI()
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open('GET', API, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function array_chunk(input, size, preserveKeys)
{
	var x;
	var p = '';
	var i = 0;
	var c = -1;
	var l = input.length || 0;
	var n = [];
	if (size < 1)
	{
		return null
	}
	if (Object.prototype.toString.call(input) === '[object Array]')
	{
		if (preserveKeys)
		{
			while (i < l)
			{
				(x = i % size) ? n[c][i] = input[i]: n[++c] = {};
				n[c][i] = input[i];
				i++
			}
		}
		else
		{
			while (i < l)
			{
				(x = i % size) ? n[c][x] = input[i]: n[++c] = [input[i]];
				i++
			}
		}
	}
	else
	{
		if (preserveKeys)
		{
			for (p in input)
			{
				if (input.hasOwnProperty(p))
				{
					(x = i % size) ? n[c][p] = input[p]: n[++c] = {};
					n[c][p] = input[p];
					i++
				}
			}
		}
		else
		{
			for (p in input)
			{
				if (input.hasOwnProperty(p))
				{
					(x = i % size) ? n[c][x] = input[p]: n[++c] = [input[p]];
					i++
				}
			}
		}
	}
	return n
}
// Notification permissions
var hasPermisisons = false;

function allowNotifications()
{
	// Let's check if the browser supports notifications
	if (!("Notification" in window))
	{
		alert("This browser does not support system notifications");
	}
	// Let's check whether notification permissions have already been granted
	else if (Notification.permission === "granted")
	{
		hasPermisisons = true;
	}
	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== 'denied')
	{
		Notification.requestPermission(function(permission)
		{
			// If the user accepts, let's create a notification
			if (permission === "granted")
			{
				hasPermisisons = true;
			}
		});
	}
}
Vue.filter('formatTimeSince', function(value)
{
	if (value)
	{
		return moment(value, 'X').fromNow();
	}
});
var app = new Vue(
{
	el: '#app',
	data:
	{
		query: '',
		districts_grouped: Object.values(JSON.parse(queryDistrictAPI()))
	},
	computed:
	{
		computedList: function()
		{
			var vm = this;
			return array_chunk(this.districts_grouped.filter(function(district)
			{
				return district.name.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
			}), 4, true)
		}
	},
	created: function()
	{
		allowNotifications();
		setInterval(this.fetchDistrictData, 5000)
	},
	methods:
	{
		fetchDistrictData: function()
		{
			var new_data = Object.values(JSON.parse(queryDistrictAPI()));
			for (district in new_data)
			{
				for (data in new_data[district])
				{
					if (this.districts_grouped[district][data] !== new_data[district][data] && this.districts_grouped[district]['name'] === new_data[district]['name'])
					{
						this.districts_grouped[district][data] = new_data[district][data];
					}
				}
			}
		},
		beforeEnter: function(el)
		{
			el.style.opacity = 0;
		},
		enter: function(el, done)
		{
			var delay = el.dataset.index * 150;
			setTimeout(function()
			{
				Velocity(el,
				{
					opacity: 1
				},
				{
					complete: done
				})
			}, delay)
		},
		leave: function(el, done)
		{
			var delay = el.dataset.index * 150;
			setTimeout(function()
			{
				Velocity(el,
				{
					opacity: 0
				},
				{
					complete: done
				})
			}, delay)
		}
	}
})
