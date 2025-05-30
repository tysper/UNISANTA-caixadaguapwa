
// General class for all widgets
class Component {
    constructor(wrapper_element_html, properties){
        this.wrapper_element_html = wrapper_element_html;
        this.active_state = properties.active_state;
        this.unactive_state = properties.unactive_state;
    }

    _change_text(text_shown){
        const dynamic_text_el = this.wrapper_element_html.querySelector(".dynamic_text");
        dynamic_text_el.textContent = `${text_shown}`;
    }

    _change_color_state(state){
        const widget_state_el = this.wrapper_element_html.querySelector(".widget__info_container > .widget__state");

        if(state){
            widget_state_el.classList.add("state_enabled")
        } else {
            widget_state_el.classList.remove("state_enabled")
        }
    }

    change_state(state){
        this._change_text(state? this.active_state: this.unactive_state);
        this._change_color_state(state);
    }
}

// Class specially for water widget
class Water_level_component extends Component {
    constructor(wrapper_element_html){
        super(wrapper_element_html, {});
    }

    _change_water_level_liquid(percentage){
        const water_level_el = this.wrapper_element_html.querySelector(".water__level_liquid");
        water_level_el.style = `top: ${100 - percentage}%;`;
    }

    _change_text_percentage(percentage){
        const water__level_text_el = this.wrapper_element_html.querySelector(".water__level_text_percent");
        water__level_text_el.textContent = `${percentage}`;
    }

    _change_text_litters(percentage){
        const total_capacity_litters = 5;
        const water__level_litter_el = this.wrapper_element_html.querySelector(".water__level_text_litter");
        water__level_litter_el.textContent = `${(total_capacity_litters*(percentage/100)).toFixed(1)}`;
    }

    change_water_level(percentage){
        this._change_water_level_liquid(percentage);
        this._change_text_litters(percentage);
        this._change_text_percentage(percentage);
    }
}

// Mapping elements with their respective "data-*" name in html
const widgets = Array.from(document.querySelectorAll(".div__widget"));
const widgets_map = {};

widgets.forEach((el) => {
    widgets_map[`${el.dataset.name}`] = el;
})

function update_lastupdate_text(){
    const lastupdate_el = document.querySelector(".div__lastupdate.div__outter > p .lastupdate__time_time");
    let last_update_text;
    
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1;     
    const date = now.getDate();           
    const hours = now.getHours();         
    const minutes = now.getMinutes();     


    last_update_text = `Atualizado em ${date.toString().padStart(2,"0")}.${month.toString().padStart(2, "0")}.${year} as ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    
    lastupdate_el.textContent = last_update_text;
}

// Creating each component to interact with the interface

const lorawan_state = new Component(widgets_map.lorawan_state, {active_state: "conectado", unactive_state: "desconectado"});
const water_pump_state = new Component(widgets_map.water_pump_state, {active_state: "ligado", unactive_state: "desligado"});
const water_level = new Water_level_component(widgets_map.water_level);

// Setting the default state of the component
lorawan_state.change_state(false);
water_pump_state.change_state(false);
water_level.change_water_level(0);

// Adding event listener in button
const update_button_el = document.querySelector(".button.button_update");

function get_updated_information(){
    return {
        lorawan: {state: true},
        water_pump: {state: true},
        water_level: {level: 90}
    }
}

function update_stats_info(){
    const update_info = get_updated_information();

    lorawan_state.change_state(update_info.lorawan.state);
    water_pump_state.change_state(update_info.water_pump);
    water_level.change_water_level(update_info.water_level.level);

    update_lastupdate_text();
}

update_button_el.addEventListener("click", (e) => {
    e.preventDefault();

    update_stats_info();
});