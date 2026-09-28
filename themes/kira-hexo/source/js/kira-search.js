/*!
 * Kira 搜索：右栏即时搜索与独立搜索页共用同一套逻辑
 * 用法：kiraSearch({ input, results, url, mode, count, clear, max, debounce })
 *   mode: 'dropdown'（右栏下拉） | 'page'（搜索页列表）
 */
(function () {
	'use strict';

	/* 搜索数据里的正文是 striptags 处理过的，会残留 &#x2F; 之类的实体，先还原 */
	function decodeEntities(s) {
		return String(s == null ? '' : s)
			.replace(/&#x([0-9a-f]+);/gi, function (m, h) {
				return String.fromCharCode(parseInt(h, 16));
			})
			.replace(/&#(\d+);/g, function (m, d) {
				return String.fromCharCode(parseInt(d, 10));
			})
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&amp;/g, '&');
	}

	function escapeHtml(s) {
		return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
			return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
		});
	}

	/* 去掉标签与实体，压平空白，供摘要使用 */
	function toPlain(s) {
		return decodeEntities(String(s == null ? '' : s).replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ');
	}

	/* 高亮：先在原文上定位，再逐段转义输出，避免转义后匹配不上 */
	function highlight(text, q) {
		text = String(text == null ? '' : text);
		if (!q) return escapeHtml(text);
		var lower = text.toLowerCase();
		var ql = q.toLowerCase();
		var out = '';
		var i = 0;
		for (;;) {
			var idx = lower.indexOf(ql, i);
			if (idx === -1) {
				out += escapeHtml(text.slice(i));
				break;
			}
			out += escapeHtml(text.slice(i, idx)) +
				'<mark>' + escapeHtml(text.slice(idx, idx + q.length)) + '</mark>';
			i = idx + q.length;
		}
		return out;
	}

	function makeSnippet(content, q, len) {
		content = toPlain(content);
		if (!content) return '';
		len = len || 110;
		var idx = q ? content.toLowerCase().indexOf(q.toLowerCase()) : -1;
		if (idx === -1) {
			return content.slice(0, len) + (content.length > len ? '…' : '');
		}
		var start = Math.max(0, idx - 24);
		var end = Math.min(content.length, idx + q.length + len);
		return (start > 0 ? '…' : '') + content.slice(start, end) +
			(end < content.length ? '…' : '');
	}

	window.kiraSearch = function (opts) {
		opts = opts || {};
		var input = document.getElementById(opts.input);
		var results = document.getElementById(opts.results);
		if (!input || !results) return null;

		var countEl = opts.count ? document.getElementById(opts.count) : null;
		var clearEl = opts.clear ? document.getElementById(opts.clear) : null;
		var isDropdown = opts.mode !== 'page';
		var max = opts.max || 0;
		var debounce = opts.debounce || 200;

		var posts = [];
		var loaded = false;
		var failed = false;
		var timer = null;
		var hits = [];
		var activeIndex = -1;

		function setClearVisible(show) {
			if (clearEl) clearEl.classList.toggle('is-visible', !!show);
		}

		function reset() {
			results.innerHTML = '';
			results.style.display = 'none';
			hits = [];
			activeIndex = -1;
			if (countEl) countEl.textContent = '';
			setClearVisible(false);
		}

		function setActive(i) {
			if (!hits.length) return;
			if (i < 0) i = hits.length - 1;
			if (i >= hits.length) i = 0;
			if (activeIndex > -1 && hits[activeIndex]) hits[activeIndex].classList.remove('is-active');
			activeIndex = i;
			var el = hits[activeIndex];
			el.classList.add('is-active');
			// 让键盘选中的项滚入结果框可视区域（只动结果框自身）
			var br = results.getBoundingClientRect();
			var er = el.getBoundingClientRect();
			if (er.top < br.top) results.scrollTop -= br.top - er.top;
			else if (er.bottom > br.bottom) results.scrollTop += er.bottom - br.bottom;
		}

		function match(q) {
			var ql = q.toLowerCase();
			return posts.filter(function (p) {
				return String(p.title || '').toLowerCase().indexOf(ql) > -1 ||
					String(p.content || '').toLowerCase().indexOf(ql) > -1;
			});
		}

		function render(list, q) {
			if (!list.length) {
				results.innerHTML = '<div class="kira-search-empty">' +
					'<i class="kirafont icon-search"></i>没有找到与「' + escapeHtml(q) + '」相关的文章</div>';
				results.style.display = 'block';
				hits = [];
				activeIndex = -1;
				return;
			}

			var shown = max ? list.slice(0, max) : list;
			var html = '';

			if (isDropdown) {
				shown.forEach(function (p) {
					var snip = makeSnippet(p.content, q, 60);
					html += '<a class="kira-search-hit" href="' + escapeHtml(p.url) + '">' +
						'<span class="kira-search-title">' + highlight(p.title, q) + '</span>' +
						(snip ? '<span class="kira-search-snippet">' + highlight(snip, q) + '</span>' : '') +
						'</a>';
				});
				results.innerHTML = html;
			} else {
				html += '<ul class="kira-search-list">';
				shown.forEach(function (p) {
					var snip = makeSnippet(p.content, q, 120);
					html += '<li><a class="kira-search-hit" href="' + escapeHtml(p.url) + '">' +
						'<span class="kira-search-title">' + highlight(p.title, q) + '</span>' +
						(snip ? '<span class="kira-search-snippet">' + highlight(snip, q) + '</span>' : '') +
						'</a></li>';
				});
				html += '</ul>';
				results.innerHTML = html;
			}

			hits = Array.prototype.slice.call(results.querySelectorAll('.kira-search-hit'));
			activeIndex = -1;
			results.style.display = 'block';

			if (countEl) {
				countEl.textContent = (max && list.length > max)
					? '找到 ' + list.length + ' 篇，显示前 ' + max + ' 篇'
					: '找到 ' + list.length + ' 篇';
			}
		}

		function search() {
			var q = input.value.trim();
			if (!q) {
				reset();
				return;
			}
			setClearVisible(true);

			if (failed) {
				results.innerHTML = '<div class="kira-search-empty">搜索数据加载失败</div>';
				results.style.display = 'block';
				return;
			}
			if (!loaded) {
				results.innerHTML = '<div class="kira-search-empty">正在加载搜索数据…</div>';
				results.style.display = 'block';
				return;
			}
			render(match(q), q);
		}

		function onInput() {
			clearTimeout(timer);
			timer = setTimeout(search, debounce);
		}

		input.addEventListener('input', onInput);
		input.addEventListener('focus', function () {
			if (input.value.trim()) search();
		});

		if (clearEl) {
			clearEl.addEventListener('click', function () {
				input.value = '';
				reset();
				input.focus();
			});
		}

		input.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowDown') {
				if (hits.length) { e.preventDefault(); setActive(activeIndex + 1); }
			} else if (e.key === 'ArrowUp') {
				if (hits.length) { e.preventDefault(); setActive(activeIndex - 1); }
			} else if (e.key === 'Enter') {
				if (activeIndex > -1 && hits[activeIndex]) {
					e.preventDefault();
					window.location.href = hits[activeIndex].getAttribute('href');
				}
			} else if (e.key === 'Escape') {
				input.value = '';
				reset();
				input.blur();
			}
		});

		if (isDropdown) {
			document.addEventListener('click', function (e) {
				if (!e.target.closest || !e.target.closest('.kira-right-search')) reset();
			});
		}

		fetch(opts.url)
			.then(function (r) { return r.json(); })
			.then(function (data) {
				posts = data || [];
				loaded = true;
				// 数据到位时用户可能已经输入了内容
				if (input.value.trim()) search();
			})
			.catch(function () {
				failed = true;
				if (input.value.trim()) search();
			});
	};
})();
