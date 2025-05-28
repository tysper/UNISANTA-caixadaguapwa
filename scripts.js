
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
        const total_capacity_litters = 2;
        const water__level_litter_el = this.wrapper_element_html.querySelector(".water__level_text_litter");
        water__level_litter_el.textContent = `${(2*(percentage/100)).toFixed(1)}`;
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
    const month = now.getMonth() + 1;     // 1–12 (add 1 because it's 0-based)
    const date = now.getDate();           // 1–31
    const hours = now.getHours();         // 0–23
    const minutes = now.getMinutes();     // 0–59



    last_update_text = `${date.toString().padStart(2,"0")}.${month.toString().padStart(2, "0")}.${year} ás ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    
    lastupdate_el.textContent = last_update_text;
}

// Creating each component to interact with the interface

const lorawan_state = new Component(widgets_map.lorawan_state, {active_state: "conectado", unactive_state: "desconectado"});

const water_pump_state = new Component(widgets_map.water_pump_state, {active_state: "ligado", unactive_state: "desligado"});
const water_level = new Water_level_component(widgets_map.water_level);

// Setting the default state of the component
lorawan_state.change_state(false);
water_pump_state.change_state(false);










