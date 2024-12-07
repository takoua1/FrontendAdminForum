import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { StatisticsService } from '../services/statistics.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule,FormsModule,NgApexchartsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
  animations: [
    trigger('menuAnimation', [
      state('open', style({
        opacity: 1,
        
        visibility: 'visible'
      })),
      state('closed', style({
        opacity: 0,
        
        visibility: 'hidden'
      })),
      transition('open <=> closed', [
        animate('0.3s')
      ])
    ])
  ]
})
export class CommentsComponent {
  selectedDate: string = '';
  selectedPeriod: string = 'day';
  selectedCategory: string = 'All';
 
  menuDay:boolean=false;
  menuWeek:boolean=false;
  menuMonth:boolean=false;
  menuYear:boolean=false;
  menuState = 'closed';
  mnuCatg  = 'closed';
  public chartPoste: ApexOptions = {  series: [],chart: {
    type: 'area',
    
    height: 350,
    toolbar: {
      show: false
    },
    background: '#f4f4f4',
    
  },
  labels: [],
  colors: ['#7D9AC5', '#A8D5BA', '#F7C6C7', '#F6E3B4', '#D8A9C3'],
  title: {
    text: 'Statistique de Commentaire'
  },
  legend: {
    position: 'bottom'
  },
  tooltip: {
    
  }};
    
  
  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
   
    this.initDropdowns();
   
this.setDefaultDate();

this.fetchStatistics(this.selectedCategory, this.selectedPeriod, this.selectedDate);
  }

  toggleMenuCateg(){
    this.mnuCatg = this.mnuCatg === 'open' ? 'closed' : 'open';
  }
  toggleMenu() {
    this.menuState = this.menuState === 'open' ? 'closed' : 'open';
  }

 
  setDefaultDate(): void {
    const today = new Date(); // Obtenir la date et l'heure actuelles
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0));
    this.selectedDate = todayUTC.toISOString(); // Format: "YYYY-MM-DDTHH:mm:ss.sssZ" avec heures à zéro
  }
  initDropdowns(): void {
    // Initialisation des dropdowns pour la période
    const periodDropdown = document.querySelector(".dropdown-period")!;
    const selectPeriod = periodDropdown.querySelector('.select') as HTMLElement;
    const caretPeriod = periodDropdown.querySelector('.caret') as HTMLElement;
    const menuPeriod = periodDropdown.querySelector('.menu') as HTMLElement;
    const optionsPeriod = periodDropdown.querySelectorAll('.menu li');
    const selectedPeriod = periodDropdown.querySelector('.selected') as HTMLElement;

    selectPeriod.addEventListener('click', () => {
      selectPeriod.classList.toggle('select-clicked');
      caretPeriod.classList.toggle('caret-rotate');
      menuPeriod.classList.toggle('menu-open');
    });

    optionsPeriod.forEach(option => {
      option.addEventListener('click', () => {
        selectedPeriod.innerText = (option as HTMLElement).innerText;
        selectedPeriod.classList.remove('selected-clicked');
        caretPeriod.classList.remove('caret-rotate');
        menuPeriod.classList.remove('menu-open');
        optionsPeriod.forEach(opt => (opt as HTMLElement).classList.remove('active'));
        (option as HTMLElement).classList.add('active');
        this.onPeriodChange((option as HTMLElement).getAttribute('value') || 'day');
      });
    });

    // Initialisation des dropdowns pour la catégorie
    const categoryDropdown = document.querySelector(".dropdown-category")!;
    const selectCategory = categoryDropdown.querySelector('.select') as HTMLElement;
    const caretCategory = categoryDropdown.querySelector('.caret') as HTMLElement;
    const menuCategory = categoryDropdown.querySelector('.menu') as HTMLElement;
    const optionsCategory = categoryDropdown.querySelectorAll('.menu li');
    const selectedCategory = categoryDropdown.querySelector('.selected') as HTMLElement;

    selectCategory.addEventListener('click', () => {
      selectCategory.classList.toggle('select-clicked');
      caretCategory.classList.toggle('caret-rotate');
      menuCategory.classList.toggle('menu-open');
    });

    optionsCategory.forEach(option => {
      option.addEventListener('click',() => {
        selectedCategory.innerText = (option as HTMLElement).innerText;
        selectedCategory.classList.remove('selected-clicked');
        caretCategory.classList.remove('caret-rotate');
        menuCategory.classList.remove('menu-open');
        optionsCategory.forEach(opt => (opt as HTMLElement).classList.remove('active'));
        
        
        (option as HTMLElement).classList.add('active');
        this.onCategoryChange ((option as HTMLElement).getAttribute('value') || 'All');
      });

    // Appelle la méthode pour changer la catégorie
 
      });}
  
  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    this.fetchStatistics(this.selectedCategory, this.selectedPeriod, this.selectedDate);
  
}

onCategoryChange(category: string): void {
  console.log('Selected Category:', category);
  this.selectedCategory=category;
  this.fetchStatistics(this.selectedCategory, this.selectedPeriod, this.selectedDate);
}
onDateChange(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  const selectedDateStr = inputElement.value;

  // Conversion de la chaîne en date
  const today = new Date(new Date().toUTCString());
const selectedDate = new Date(new Date(selectedDateStr).toUTCString());

  // Vérification de la validité de la date
  if (isNaN(selectedDate.getTime())) {
    console.error('Invalid date selected:', selectedDateStr);
    return;
  }

  

  const diffTime = Math.abs(today.getTime() - selectedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  

  if (diffDays < 7) {
   this.menuDay = true;
  } else if (diffDays === 7 || (diffDays > 7 && diffDays < 30)) {
    this.menuDay = true;
    this.menuWeek = true;
  } else if (diffDays === 30 || (diffDays > 30 && diffDays < 365)) {
    this.menuDay = true;
    this.menuWeek = true;
    this.menuMonth = true
  } else {
    this.menuDay = true;
    this.menuWeek = true;
    this.menuMonth = true;
    this.menuYear = true;
  }

  // Met à jour le menu de période pour refléter la sélection actuelle
  
  const selectedDateISO = selectedDate.toISOString();
 
  // Récupère les statistiques basées sur la nouvelle période et la catégorie sélectionnée
  this.fetchStatistics(this.selectedCategory, this.selectedPeriod, selectedDateISO);
}


  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
  determinePeriodBasedOnDate(date: string): string {
    const selectedDate = new Date(date);
    const currentDate = new Date();

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;
    const oneYear = 365 * oneDay;

    const differenceInTime = currentDate.getTime() - selectedDate.getTime();

    if (differenceInTime < oneWeek) {
      return 'day';
    } else if (differenceInTime < oneMonth) {
      return 'week';
    } else if (differenceInTime < oneYear) {
      return 'month';
    } else {
      return 'year';
    }
  }

  fetchStatistics(category: string, period: string, date: string,): void {

    console.log('Fetching statistics with:', {
      category,
      period,
    date
    });
  
    // Vérifiez que la chaîne représente une date valide
    const dateSelected = new Date(date);
    if (isNaN(dateSelected.getTime())) {
      console.error('Invalid date format:', date);
      return;
    }

    const formattedDate = dateSelected .toISOString();
    this.statisticsService.getCommentsCatgeStatistics(category,period, formattedDate ).subscribe
      ((data: { [key: string]: { [key: string]: number } })=> {
        console.log('Données reçues pour transformation:', data);
       /* const transformedData = this.transformDataToChartFormat(data);
        this.chartData = transformedData;*/
        const transformedData = this.transformDataToChartFormat(data);
        this.updateChart(transformedData);
      },
      error => {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    );
  }

  
 

      transformDataToChartFormat(data: { [key: string]: { [key: string]: number } }): { series: { name: string, data: number[] }[], categories: string[] } {
        const categoryCounts: { [key: string]: number[] } = {};
        const categories: string[] = [];
    
        Object.keys(data).forEach((timeSlot) => {
            categories.push(timeSlot);
            Object.keys(data[timeSlot]).forEach((category) => {
                if (!categoryCounts[category]) {
                    categoryCounts[category] = [];
                }
                categoryCounts[category].push(data[timeSlot][category]);
            });
        });
    
        const series = Object.keys(categoryCounts).map(category => ({
            name: category,
            data: categoryCounts[category]
        }));
    
        return {
            series: series,
            categories: categories
        };
    }
    
    
      updateChart(transformedData: { series: { name: string, data: number[] }[], categories: string[] }): void {
        this.chartPoste.series = transformedData.series;
        this.chartPoste.xaxis = { categories: transformedData.categories };
      }
}
