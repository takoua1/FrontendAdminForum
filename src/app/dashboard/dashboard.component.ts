import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);
import { PostStatistics, StatisticsService } from '../services/statistics.service';
import { catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApexOptions, NgApexchartsModule , ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle} from 'ng-apexcharts';





@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule, ReactiveFormsModule,NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  chart: Chart<'doughnut', number[], string> | undefined;
  selectedPeriod: string = 'year';
  period: string | null = null;
  startDate: string ='';
  endDate: string ='';
  public totalPostes: number = 0; 
  public totalComments: number = 0;
  public totalGroups:number=0;
  public totalUsers:number=0;
  public totalActif:number=0;
  year!: number;
  month!: number;
  week!: number;
  day!: string; // Changed to string to hold date input value
 
  public chartDataPoste: any;
  public chartDataComment: any;
  public chartDataGroup: any;
  public chartPotes: ApexOptions={ series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    labels: [],
    colors: [],
    title: {
      text: 'Postes par Catégorie'
    },
    legend: {
      position: 'bottom'
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toFixed(2)}%`
      }
    }};
 public chartComments:ApexOptions={ series: [],chart: {
  type: 'pie',
  height: 350
},
labels: [],
colors: [],
title: {
  text: 'Comments par Catégorie'
},
legend: {
  position: 'bottom'
},
tooltip: {
  y: {
    formatter: (value) => `${value.toFixed(2)}%`
  }
}};
 public chartGroups:ApexOptions={ series: [],chart: {
  type: 'pie',
  height: 350
},
labels: [],
colors: [],
title: {
  text: 'Groupes par Catégorie'
},
legend: {
  position: 'bottom'
},
tooltip: {
  y: {
    formatter: (value) => `${value.toFixed(2)}%`
  }
}};
public chartUsers: ApexOptions = {
  series: [],
  chart: {
    type: 'area',
    height: 350,
    background: '#f4f4f4',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
 
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    title: {
      text: 'Pourcentage (%)'
    }
  },
  title: {
    text: 'Statistiques des Utilisateurs par Période'
  },
  stroke: {
    curve: 'smooth'
  }, grid: {
    borderColor: '#f1f1f1'
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 100]
    }
  }
 
};
public chartUsersActif: ApexOptions = {  series: [],chart: {
  type: 'pie',
  height: 350,
  toolbar: {
    show: false
  },
  background: '#f4f4f4',
},
labels: ['Connecté', 'Déconnecté'],
colors: ['#7D9AC5','#F7C6C7'],
title: {
  text: 'User Actif'
},
legend: {
  position: 'bottom'
},
tooltip: {
  y: {
    formatter: (value) => `${value.toFixed(2)}%`
  }
}};
  constructor(private statisticsService: StatisticsService) { 

    
    Chart.register(...registerables);
  }


 
  
  

  


    
  ngOnInit(): void {
  

   this.period='day';
   
      // Fetch statistics based on the selected period and date range
      if (this.startDate && this.endDate) {
        this. fetchStatistics(this.startDate, this.endDate);
      }

     this.initDropdowns();
     this.updateDateRange();
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
        this.onPeriodChange((option as HTMLElement).getAttribute('value') || 'year');
      });
    });


  }
  onPeriodChange(period: string): void {
    this.period =period
    this.updateDateRange();
    // Fetch statistics based on the selected period and date range
    if (this.startDate && this.endDate) {
      this. fetchStatistics(this.startDate, this.endDate);
    }
  }
  updateDateRange(): void {
    const today = new Date();
    switch (this.period) {
      case 'year':
        const year = today.getFullYear();
        this.startDate = new Date(year, 0, 1).toISOString().split('T')[0];
        this.endDate = new Date(year, 11, 31).toISOString().split('T')[0];
        break;
      case 'month':
        const month = today.getMonth();
        const yearMonth = today.getFullYear();
        this.startDate = new Date(yearMonth, month, 1).toISOString().split('T')[0];
        this.endDate = new Date(yearMonth, month + 1, 0).toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = this.getStartOfWeek(today);
        this.startDate = weekStart.toISOString().split('T')[0];
        this.endDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6).toISOString().split('T')[0];
        break;
      case 'day':
        this.startDate = today.toISOString().split('T')[0];
        this.endDate = this.startDate;
        break;
      default:
        this.startDate = '';
        this.endDate = '';
    }
    if (this.startDate && this.endDate) {
      this. fetchStatistics(this.startDate, this.endDate);
    }
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay() || 7; // Get day of the week (1-7, Monday-Sunday)
    if (day !== 1) date.setHours(-24 * (day - 1)); // Set to Monday
    return date;
  }

  fetchStatistics(startDate: string, endDate: string): void {
  
    this.statisticsService. getPercentagePostesStatistics(startDate, endDate).subscribe(
      data => {
        const percentages = data.percentages;
    const categories = Object.keys(percentages);
    const percentageValues = Object.values(percentages) as number[];
        this.totalPostes = data.totalPostes; // Total des postes
        console.log('Données reçues:', data); 
        console.log("totalPostes",this.totalPostes)
        const colors = ['#7D9AC5', '#A8D5BA', '#F7C6C7', '#F6E3B4', '#D8A9C3'];

      this.chartPotes = {
       series:  percentageValues,
        chart: {
          type: 'donut',
          height: 350,
          toolbar: {
            show: false
          },
          background: '#f4f4f4',
          
        },
        labels: categories,
        colors: colors,
       
          
        
        title: {
          text: 'Postes par Catégorie',
          align: 'left',
    style: {
      fontSize: '18px',
      color: '#666'
    }
        },
       legend: {
          position: 'bottom'
        },
        tooltip: {
          y: {
            formatter: (value) => `${value.toFixed(2)}%`
          }
        }
      };
        console.log('Données reçues pour transformation:', data);
        this.chartDataPoste = this.transformDataToChartFormat(data);
      
      },
      error => {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    );
  
    this.statisticsService. getPercentageGroupsStatistics(startDate, endDate).subscribe(
      data => {
        const percentages = data.percentages;
    const categories = Object.keys(percentages);
    const percentageValues = Object.values(percentages) as number[];

        this.totalGroups = data.total;
        const colors = ['#7D9AC5', '#A8D5BA', '#F7C6C7', '#F6E3B4', '#D8A9C3'];

      this.chartGroups = {
       series: percentageValues ,
        chart: {
          type: 'donut',
          height: 350,
          toolbar: {
            show: false
          },
          background: '#f4f4f4',
          
        },
        labels: categories,
        colors: colors,
       
        title: {
          text: 'Groupes par Catégorie',
          align: 'left',
    style: {
      fontSize: '18px',
      color: '#666'
    }
        },
      
      legend: {
          position: 'bottom'
        },
        tooltip: {
          y: {
            formatter: (value) => `${value.toFixed(2)}%`
          }
        }
      };
        console.log('Données reçues pour transformation:', data);
        this.chartDataComment = this.transformDataToChartFormat(data);
     
      },
      error => {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    );
    this.statisticsService.  getPercentageCommentsStatistics(startDate, endDate).subscribe(
      data => {
        
    const percentages = data.percentages;
    const categories = Object.keys(percentages);
    const percentageValues = Object.values(percentages) as number[];
        const colors = ['#7D9AC5', '#A8D5BA', '#F7C6C7', '#F6E3B4', '#D8A9C3'];
        this.totalComments = data.total;
      this.chartComments = {
       series:percentageValues,
        chart: {
          type: 'donut',
          height: 350,
          toolbar: {
            show: false
          },
          background: '#f4f4f4',
          
        },
        labels: categories,
        colors: colors,
      
        title: {
          text: 'Commentaires par Catégorie',
          align: 'left',
    style: {
      fontSize: '18px',
      color: '#666'
    }
        },
       legend: {
          position: 'bottom'
        },
        tooltip: {
          y: {
            formatter: (value) => `${value.toFixed(2)}%`
          }
        }
      };
        console.log('Données reçues pour transformation:', data);
        this.chartDataGroup = this.transformDataToChartFormat(data);
       
      },
      error => {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    );
    const granularity = this.period;
    this.statisticsService.getPercentageUsersStatistics(startDate, endDate, granularity!).subscribe(data => {
      if (data && data.length > 0) {
        // Extraction des périodes et des pourcentages depuis les données
        const periods = data.map((item: any) => item.period);
        const values = data.map((item: any) => parseFloat(item.percentage.toFixed(2)));
    
        // Récupération du total d'utilisateurs (dernier élément de la liste)
        this.totalUsers = data.reduce((sum:any, item:any) => sum + item.total, 0);
    
        console.log("Données des utilisateurs :", data);
    
        // Configuration du graphique avec ApexCharts
        this.chartUsers = {
          series: [
            {
              name: 'Utilisateurs',
              data: values
            }
          ],
          chart: {
            type: 'area',
            height: 350,
            background: '#f4f4f4',
            toolbar: {
              show: false
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Statistiques des Utilisateurs',
            align: 'left'
          },
          xaxis: {
            categories: periods,
            title: {
              text: 'Période'
            }
          },
          yaxis: {
            title: {
              text: 'Pourcentage (%)'
            }
          },
          grid: {
            borderColor: '#f1f1f1'
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.5,
              opacityTo: 0.1,
              stops: [0, 100]
            }
          }
        };
      } else {
        console.warn("Aucune donnée trouvée pour les statistiques des utilisateurs.");
        // Gérer les cas où les données sont vides ou nulles
        this.totalUsers = 0;
        this.chartUsers = {
          series: [],
          chart: {
            type: 'area',
            height: 350
          },
          title: {
            text: 'Aucune donnée disponible',
            align: 'center'
          }
        };
      }
    });
    
this.statisticsService.getUserStatusPercentage().subscribe((data:any) => {
  this.chartUsersActif.series = [data['connectedPercentage'], data['disconnectedPercentage']];

  this.totalActif=data['connectedCount'] as number;
}, error => {
  console.error('Error loading user status percentages', error);
});

  }
  transformDataToChartFormat(data: any): any {
    const labels: string[] = Object.keys(data);
    const percentages: number[] = Object.values(data);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Pourcentage de postes',
          data: percentages,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }

 
  /*  fetchStatistics(startDate: string, endDate: string): void {
    this.statisticsService. getpercentagePostesStatistics(startDate, endDate).subscribe(
      data => {
        console.log('Données reçues pour transformation:', data);
        this.chartData = this.transformDataToChartFormat(data);
        this.createChart(); // Mettre à jour le graphique avec les nouvelles données
      },
      error => {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    );
  }

  transformDataToChartFormat(data: any): any {
    const labels: string[] = Object.keys(data);
    const percentages: number[] = Object.values(data);
    const colors: string[] = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
  
    return {
      labels: labels,
      datasets: [
        {
          label: 'Pourcentage de postes',
          data: percentages,
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }
      ]
    };
  }
 
  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  
    if (ctx) {
      if (this.chart) {
        this.chart.destroy();
      }
  
      const chartConfig: ChartConfiguration<'doughnut', number[], string> = {
        type: 'doughnut',
        data: this.chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  const percentage = tooltipItem.raw as number;
                  return `${tooltipItem.label}: ${percentage}%`;
                }
              }
            }
          }
        }
      };
  
      this.chart = new Chart(ctx.getContext('2d')!, chartConfig);
    } else {
      console.error('Canvas element with id "myChart" not found.');
    }
  }}
initDropdowns():void
  {
    const dropdowns = document.querySelectorAll(".dropdown") ;

    dropdowns.forEach(dropdown=>{
      const select = document.querySelector('.select');
      const caret = document.querySelector('.caret');
      const menu = document.querySelector('.menu');
      const options = document.querySelectorAll('.menu li') ;
      const selected = document.querySelector('.selected') as HTMLElement;

      select?.addEventListener('click',()=>{
        select?.classList.toggle('select-clicked');
        caret?.classList.toggle('caret-rotate');
        menu?.classList.toggle('menu-open');

      });
      
      options.forEach(option => {
        option.addEventListener('click', () => {
          if (selected) {
            selected.innerText = (option as HTMLElement).innerText;
            selected?.classList.remove('selected-clicked');
            caret?.classList.remove('caret-rotate');
            menu?.classList.remove('menu-open');

            options.forEach(opt => {
              (opt as HTMLElement).classList.remove('active');
            });

            (option as HTMLElement).classList.add('active');
          }
        });
      });
    });


  }
  ngOnInit(): void {

this.menu();
  }
  fetchStatistics(period: string): void {
    this.statisticsService.getPostesStatistics(period).subscribe(
      data => this.createChart(data),
      error => console.error('Erreur lors de la récupération des statistiques', error)
    );
  }

  createChart(data: any): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement | null;
    if (ctx) {
      const context = ctx.getContext('2d');
      if (context) {
        const labels = Object.keys(data); // Inclut toutes les catégories
        const values = labels.map(key => data[key]); // Extrait les valeurs, y compris les zéros

        if (this.chart) {
          this.chart.destroy(); // Détruit l'ancien graphique avant d'en créer un nouveau
        }

        this.chart = new Chart(context, {
          type: 'bar', // ou 'line', 'pie', etc.
          data: {
            labels: labels,
            datasets: [{
              label: 'Statistiques',
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                beginAtZero: true
              },
              y: {
                beginAtZero: true
              }
            }
          }
        });
      } else {
        console.error('Contexte du canvas non trouvé');
      }
    } else {
      console.error('Élément canvas non trouvé');
    }
  }


  onPeriodChange(period: string): void {
    // Mettez à jour le texte sélectionné et le traitement de la période ici
    this.selectedPeriod = period;
    this.fetchStatistics(this.selectedPeriod);
    // Optionnel : Vous pouvez déclencher une action ou appeler un service
    // pour obtenir des statistiques basées sur la période sélectionnée
  }
 /*  onPeriodChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPeriod = selectElement.value;
    this.fetchStatistics(selectedPeriod);
  }
 fetchStatistics() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token.getToken()}`);
    this.http.get('/api/statistics/postes/period?period=month', { headers }).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.error('Error fetching statistics:', error);
      }
    );
  }loadChart(period: string): void {
    this.statisticsService.getPostesStatistics(period).subscribe(data => {
      const labels = Object.keys(data);
      const values = Object.values(data);

      this.chart = new Chart('chartCanvas', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Postes Statistics',
            data: values,
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: {
              beginAtZero: true
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }
  createChart(data: any) {
    const categories = Object.keys(data);
    const values = Object.values(data);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: '# of Posts',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }*/

   formatWeekRange(isoWeek: string): string {
      const [year, week] = isoWeek.split('-W').map(Number);
    
      // Obtenir la première date de la semaine
      const firstDayOfWeek = new Date(year, 0, (week - 1) * 7 + 1);
      const dayOfWeek = firstDayOfWeek.getDay(); // Jour de la semaine (0=Dimanche)
      const startOfWeek = new Date(firstDayOfWeek);
      startOfWeek.setDate(firstDayOfWeek.getDate() - dayOfWeek + 1); // Lundi de la semaine
    
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche de la semaine
    
      // Formatage des dates
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      const start = startOfWeek.toLocaleDateString('en-GB', options);
      const end = endOfWeek.toLocaleDateString('en-GB', options);
    
      return `${start} - ${end}`;
    }
   
  }