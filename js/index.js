const tool_id = 'id_selector';

let chosenCraft = new Set()

$(document).ready(function(){
    createTable();
	chosenCraft.clear()
	$("#craft_id_string").on("click", craftString);
	$("#reset_chosen").on("click", resetChosen);
	$(".result-row").css({'display': 'none'})
    
    $('#toTop-btn').click(() => { 
        $('html,body').animate({
            scrollTop: 0
        }, 300);
    });
    
    $(window).scroll(() => {
        if ($(this).scrollTop() > 300) $('#toTop-btn').fadeIn(200);
        else $('#toTop-btn').stop().fadeOut(200);
    }).scroll();
});

$(window).resize(function(){
    $('.side_navigation').css({top: (parseInt($('#top-bar').css('height'))-20)+'px'});
});

function createTable() {
	const craftPureName = new Set()
	const craftDataByName = {}
	
	armed_craft_data.forEach(craft => {
		const pureName = getPureName(craft.name)
		if(!craftDataByName[pureName]) {
			craftDataByName[pureName] = {}
		}
		
		if(!craftDataByName[pureName]?.monster) {
			craftDataByName[pureName].monster = craft.monster
		}
		
		craftPureName.add(getPureName(craft.name))
		craftDataByName[getPureName(craft.name)][craft.mode] = craft.id
	})
	const craftTypeImg = [1, 2, 3, 35, 58, 75, 112, 171, 246, 329]
	
	let tableHtml = `
		<table class="table table-bordered table-responsive">
			<thead class="thead-dark">
				<tr>
					<th class="align-middle" style='width: 20%; text-align: center;'>召喚獸</th>
					${craft_mode_type_string.map((str, index) => '<th style=\'width: 8%; text-align: center;\' onClick=\'selectWholeColumn("'+str+'", '+JSON.stringify(craftDataByName)+')\'><img src=\'../tos_tool_data/img/craft/'+craftTypeImg[index]+'.png\' width=\'50px\'\></th>').join('')}
				</tr>
			</thead>
			<tbody>
				${
					Object.keys(craftDataByName).map(craft => {
						const allTypeCraft = Object.keys(craftDataByName[craft]).filter(c => c!=='monster').map(c => craftDataByName[craft][c])
						return `
							<tr>
								<td class="align-middle" onClick='selectWholeRow(`+JSON.stringify(allTypeCraft)+`)'>
									${
										craftDataByName[craft]?.monster ? craftDataByName[craft]?.monster?.map(monster => {
											return `<img src='../tos_tool_data/img/monster/${monster}.png' width='50px'\>`
										}).join('')
										: ``
										
									}
								</td>
								${
									craft_mode_type_string.map(type => {
										const craftName = armed_craft_data.find(c => c.id === craftDataByName[craft][type])?.name
										const errorTypeId = craftTypeImg[craft_mode_type_string.findIndex(t => t === type)]
										return craftDataByName?.[craft]?.[type] ? `
											<td class="align-middle craft-td" id="craft-${craftDataByName[craft][type]}" style="text-align: center;" onClick='onClickCraft(${craftDataByName[craft][type]})'>
												${`<img title='${craftName}' alt='${craftDataByName[craft][type]}' src='../tos_tool_data/img/craft/${craftDataByName[craft][type]}.png' onerror='this.src="../tos_tool_data/img/craft/${errorTypeId}.png"' width='50px' onClick='onClickCraft(${craftDataByName[craft][type]})'\>`}
											</td>
										` : '<td></td>'
									}).join('')
								}
							</tr>
						`
					}).join('')
					
				}
			</tbody>
		</table>
	`
	$('.armed-craft-row').html(tableHtml)
	
}

function getPureName(name) {
	return name.replace(/\s|‧/g, '').replace(/【(.*?)】/g, '').replace(/龍紋|龍印|龍咒|龍符|龍玉|龍刃|龍璃|龍結|龍丸|龍弦/g, '').replace(/連鎖|轉動|破碎|映照|疾速|裂空|落影|擴散|鏡像|節奏/g, '')
}

function onClickCraft(id) {
	event.stopPropagation()
	const craftTd = $('#craft-'+id).get(0)
	
	if(chosenCraft.has(id)) {
		chosenCraft.delete(id)
		craftTd.style.backgroundColor = 'transparent'
		craftTd.style.boxShadow = 'none'
	}
	else {
		chosenCraft.add(id)
		craftTd.style.backgroundColor = '#27B821'
		craftTd.style.boxShadow = 'inset 2px 2px green, inset -2px -2px green'
	}
}

function selectWholeRow(allCraft) {
	allCraft.forEach(craft => onClickCraft(craft))
}

function selectWholeColumn(type, data) {
	Object.keys(data).filter(name => data[name][type]).map(name => data[name][type]).forEach(craft => onClickCraft(craft))
}

function resetChosen() {
	chosenCraft.clear()
	$('.craft-td').css({'background-color': 'transparent', 'box-shadow': 'none'})
}

function craftString() {
	if([...chosenCraft].length === 0) {
		alert('請先選擇龍刻')
		return 
	}
	
	$("#result-row").html([...chosenCraft].sort().join(' '))
	$(".result-row").css({'display': 'block'})
    jumpTo("result_title");
}