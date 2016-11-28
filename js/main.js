//3.通用函数
		function g(selector){
			var method = selector.substr(0,1) == '#'?'getElementById':'getElementsByClassName';
			return document[method](selector.substr(1));

		}
		//6.随机生成一个值 支持取值范围 random([min,max])
		function random(range){
			var max=Math.max(range[0],range[1]);
			var min=Math.min(range[0],range[1]);
			var diff = max-min;
			var number = Math.ceil(Math.random()*diff + min);
			return number;
		}
		//4.输出所有照片
		var data = data;
		function addPhoto(){
			var template = g('#wrap').innerHTML;
			var html = [];
			var nav=[];
			for(var s=1;s<data.length;s++){
				var _html=template
								.replace('{{index}}',s)
								.replace('{{img}}',data[s-1].img)
								.replace('{{caption}}',data[s-1].caption)
								.replace('{{desc}}',data[s-1].desc)
				html.push(_html);
				nav.push('<span id="nav_'+s+'" onclick="turn(g(\'#photo_'+s+'\'))" class="i">&nbsp;</span>')

			}
			html.push('<div class="nav">'+nav.join('')+'</div>');
			g('#wrap').innerHTML=html.join('');
			rosrt(random([0,data.length]));
		}
		addPhoto();
		//7.计算计算左右分区的范围 {left:{x:[min,max]},right{}}
		function r(){
			var r = {
				left:{
					x:[],
					y:[]
				},
				right:{
					x:[],
					y:[]
				}
			};
			var wrap={
				w:g('#wrap').clientWidth,
				h:g('#wrap').clientHeight
			}
			var photo={
				w:g('.photo')[0].clientWidth,
				h:g('.photo')[0].clientHeight
			}
			r.wrap = wrap;
			r.photo = photo;
			r.left.x=[0-photo.w,wrap.w/2-photo.w/2];
			r.left.y=[0-photo.h,wrap.h];
			r.right.x=[wrap.w/2+photo.w/2,wrap.w+photo.w];
			r.right.y=r.left.y
			return r;
		}
		//5.排序照片
		function rosrt(n){
			var _photo = g('.photo');
			var photos = [];
			for(s=0;s<_photo.length;s++){
				_photo[s].className = _photo[s].className.replace(/\s*photo_center\s*/,'');
				_photo[s].className = _photo[s].className.replace(/\s*photo_front\s*/,'');
				_photo[s].className = _photo[s].className.replace(/\s*photo_back\s*/,'');
				_photo[s].style.left='';
				_photo[s].style.top= '';
				_photo[s].style['-webkit-transform']='rotate(360deg)';
				_photo[s].style['transform']='rotate(360deg)scale(1.2)';
				_photo[s].className +=" photo_front ";
				photos.push(_photo[s]);
				//console.log(_photo[s]);
			}

			var photo_center =g('#photo_'+n);
			photo_center.className += ' photo_center';

			photo_center = photos.splice(n-1,1)[0];
			//console.log(photos.length);

			//把海报分为左右两个部分
			var photos_left=photos.splice(0,Math.ceil(photos.length/2));
			//console.log(photos_left);
			var photos_right=photos;
			//console.log(photos_right);

			var ranges=r();
			for(s in photos_left){
				var photo = photos_left[s];
				photo.style.left=random(ranges.left.x)+'px';
				photo.style.top=random(ranges.left.y)+'px';
				photo.style['transform'] = photo.style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg)scale(1) ';
			}
			for(s in photos_right){
				var photo = photos_right[s];
				photo.style.left=random(ranges.right.x)+'px';
				photo.style.top=random(ranges.right.y)+'px';
				photo.style['transform'] = photo.style['-webkit-transform'] = 'rotate('+random([-100,100])+'deg)scale(1) ';
			
			}
			//控制按钮处理 清除之前的classname
			var navs=g('.i');
			for(var s=0;s<navs.length;s++){
				navs[s].className=navs[s].className.replace(/\s*i_current\s*/,' ');
				navs[s].className=navs[s].className.replace(/\s*i_back\s*/,' ');
			}
			g('#nav_'+n).className += ' i_current ';

		}
		//1.翻面控制
		function turn (elem){
			var cls = elem.className;
			var n=elem.id.split('_')[1];
			//判断点击的照片是否是当前居中的照片，不是则不能翻转
			if(!/photo_center/.test(cls)){
				return rosrt(n);
			}

			if(/photo_front/.test(cls)){
				cls=cls.replace(/photo_front/,'photo_back');
				g('#nav_'+n).className += 'i_back';
			}else{
				cls=cls.replace(/photo_back/,'photo_front');
				g('#nav_'+n).className=g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
			}
			return elem.className=cls;
		}